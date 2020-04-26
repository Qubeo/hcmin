use serde_derive::{ Deserialize, Serialize };
use holochain_json_derive::DefaultJson;
use hdk::{
    self,
    entry,
    // from,
    // link,
    entry_definition::ValidatingEntryType,
    holochain_core_types::{
        dna::entry_types::Sharing,
        time::Timeout,
        time::Iso8601,
    },
    holochain_json_api::{
        json::JsonString,
        error::JsonError,
    },
    prelude::*,
    holochain_persistence_api::cas::content::Address
};

pub mod handlers;
pub mod validation;

pub const PT_PROMISE_ENTRY_NAME: &str = "pt_promise";
pub const PT_PROMISE_LINK_TYPE: &str = "pt_promise_link";
pub const PT_PROMISES_ANCHOR_TYPE: &str = "pt_promises";
pub const PT_PROMISES_ANCHOR_TEXT: &str = "pt_promises";


// see https://developer.holochain.org/api/0.0.46-alpha1/hdk/ for info on using the hdk library

// This is a sample zome that defines an entry type "MyEntry" that can be committed to the
// agent's chain via the exposed function create_my_entry

#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PTPromise {
    id: Address,
    title: String,
    context: String,
    content: String,
    created_at: Iso8601,
    lifetime: i32,
    location: Location
}

#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
pub struct PTAgent {

}

#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
pub struct Position {
    lat: f32,
    lng: f32,
}

#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
pub struct Location {
    city: String,
    country: String,
    position: Position,
}

#[derive(Serialize, Deserialize, Debug, DefaultJson,Clone)]
#[serde(rename_all = "camelCase")]
// Q: Misleading naming? Entry as in "entered input" vs. the Holochain entry, that goes to the DHT? But it does go to DHT.
// Q: So what's PTPromise? Why do the other fields created_at not get written to the chain, DHT?
pub struct PTPromiseEntry {
    title: String,
    content: String,
}

pub fn timestamp(address: Address) -> ZomeApiResult<Iso8601> {
    let options = GetEntryOptions{status_request: StatusRequestKind::Initial, entry: false, headers: true, timeout: Timeout::new(10000)};
    let entry_result = hdk::get_entry_result(&address, options)?;
    match entry_result.result {
        GetEntryResultType::Single(entry) => {
            Ok(entry.headers[0].timestamp().clone())
        },
        _ => {
            unreachable!()
        }
    }
}

// Implement a constructor
// Q: Why are we instantiating this type from the entry and not vice versa??
impl PTPromise {
    pub fn new(id: Address, pt_promise_entry: PTPromiseEntry) -> ZomeApiResult<PTPromise> {
        // Ok( handlers::get_default_pt_promise(id) )        
        let ptpos = Position { lat: 28.4, lng: 32.5 };
        let ptloc = Location { city: "KH".to_string(), country: "CZ".to_string(), position: ptpos};    
        
        Ok(PTPromise {
            id: id.clone(),
            created_at: timestamp(id)?,
            title: pt_promise_entry.title,
            content: pt_promise_entry.content,
            context: "[Default context]".to_string(),
            lifetime: 0,
            location: ptloc,
        })
    }
}

pub fn pt_promise_definition() -> ValidatingEntryType {
    entry!(
        name: PT_PROMISE_ENTRY_NAME,
        description: "PTPromise entry",
        sharing: Sharing::Public,
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },
        validation: | validation_data: hdk::EntryValidationData<PTPromiseEntry>| {
            match validation_data
            {
                hdk::EntryValidationData::Create{entry, validation_data} =>
                {
                    validation::validate_entry_create(entry, validation_data)
                },
                hdk::EntryValidationData::Modify{new_entry, old_entry, old_entry_header, validation_data} =>
                {
                    validation::validate_entry_modify(new_entry, old_entry, old_entry_header, validation_data)
                },
                hdk::EntryValidationData::Delete{old_entry, old_entry_header, validation_data} =>
                {
                    validation::validate_entry_delete(old_entry, old_entry_header, validation_data)
                }
            }
        },
        links: [
            from!(
                holochain_anchors::ANCHOR_TYPE,
                link_type: PT_PROMISE_LINK_TYPE,                        // Q: Can only be associated with one type of base ~ target pair? If so, why?
                validation_package: || {
                    hdk::ValidationPackageDefinition::Entry
                },
                validation: |validation_data: hdk::LinkValidationData| {
                    match validation_data
                    {
                        hdk::LinkValidationData::LinkAdd{link, validation_data} =>
                        {
                            validation::validate_link_add(link, validation_data)
                        },
                        hdk::LinkValidationData::LinkRemove{link, validation_data} =>
                        {
                            validation::validate_link_remove(link, validation_data)
                        }
                    }
                }
            ),
            from!(
                PT_PROMISE_ENTRY_NAME,
                link_type: "pt_entries",
                validation_package: || {
                    hdk::ValidationPackageDefinition::Entry
                },
                validation: |validation_data: hdk::LinkValidationData| {
                    match validation_data
                    {
                        hdk::LinkValidationData::LinkAdd{link, validation_data} =>
                        {
                            validation::validate_link_add(link, validation_data)
                        },
                        hdk::LinkValidationData::LinkRemove{link, validation_data} =>
                        {
                            validation::validate_link_remove(link, validation_data)
                        }
                    }
                }
            )
        ]
    )
}
