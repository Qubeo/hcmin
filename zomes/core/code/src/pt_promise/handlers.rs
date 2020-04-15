 use hdk::{
    error::ZomeApiResult,
    holochain_core_types::{
        entry::Entry,
    },
    holochain_persistence_api::cas::content::{
        Address,
        AddressableContent
    },
    prelude::*,
};

use holochain_anchors::anchor;

use crate::pt_promise::{
    PTPromiseEntry,
    PTPromise,
    // Location,
    // Position,
    PT_PROMISE_ENTRY_NAME,
    PT_PROMISES_ANCHOR_TYPE,
    PT_PROMISES_ANCHOR_TEXT,
    PT_PROMISE_LINK_TYPE,
    // timestamp,
};



fn pt_promises_anchor() -> ZomeApiResult<Address> {
    anchor(PT_PROMISES_ANCHOR_TYPE.to_string(), PT_PROMISES_ANCHOR_TEXT.to_string())
}

// CRUD
// CREATE
pub fn create_pt_promise(pt_promise_entry: PTPromiseEntry) -> ZomeApiResult<PTPromise> {
    let entry = Entry::App(PT_PROMISE_ENTRY_NAME.into(), pt_promise_entry.clone().into());
    let address = hdk::commit_entry(&entry)?;    

    hdk::link_entries(&pt_promises_anchor()?, &address, PT_PROMISE_LINK_TYPE, "")?;
    PTPromise::new(address, pt_promise_entry)
    
}

// READ
pub fn get_pt_promise(id: Address) -> ZomeApiResult<PTPromise> {
    let pt_promise: PTPromiseEntry = hdk::utils::get_as_type(id.clone())?;
    PTPromise::new(id, pt_promise)

}

// UPDATE
pub fn update_pt_promise(id: Address, pt_promise_input: PTPromiseEntry) -> ZomeApiResult<PTPromise> {
    let address = match hdk::get_entry(&id.clone())? {
        None => id.clone(),
        Some(entry) => entry.address()
    };
    hdk::update_entry(Entry::App(PT_PROMISE_ENTRY_NAME.into(), pt_promise_input.clone().into()), &address)?;
    PTPromise::new(id, pt_promise_input)
}

// DELETE
pub fn remove_pt_promise(id: Address) -> ZomeApiResult<Address> {
    
    hdk::remove_link(&pt_promises_anchor()?, &id, PT_PROMISE_LINK_TYPE, "")?;
    hdk::remove_entry(&id)

}


pub fn list_pt_promises() -> ZomeApiResult<Vec<PTPromise>> {
     hdk::get_links_and_load(&pt_promises_anchor()?, LinkMatch::Exactly(PT_PROMISE_LINK_TYPE), LinkMatch::Any)
        .map(|pt_promise_list|{
            pt_promise_list.into_iter()
                .filter_map(Result::ok)
                .flat_map(|entry| {
                    let id = entry.address();
                    hdk::debug(format!("list_entry{:?}", entry)).ok();
                    get_pt_promise(id)
                }).collect()
        })
}
