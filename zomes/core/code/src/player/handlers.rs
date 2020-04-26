#![allow(unused_imports)]
#![allow(dead_code)]

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
        json::RawString,
    },
    prelude::*,
    // holochain_persistence_api::cas::content::Address
};

use hdk::error::ZomeApiResult;
use hdk::AGENT_ADDRESS;

use crate::player::{
    Player,
    PLAYER_ENTRY_NAME,
    PLAYER_TO_SEED_LINK,
    // PLAYER_TO_TOSS_LINK,
    PLAYER_TO_AGENT_LINK,
    PLAYER_FROM_AGENT_LINK,
    PLAYER_FROM_SEED_LINK,
    PLAYER_TO_TOSS_RESULT_LINK,
};

pub const SEED_ENTRY_NAME: &str = "seed";                   // Q: Again, seems redundant.
pub const TOSS_ENTRY_NAME: &str = "toss";
pub const TOSS_RESULT_ENTRY_NAME: &str = "toss_result";

pub const PLAYER_DIRECTORY_ANCHOR: &str = "player_directory";
pub const DIRECTORY_PLAYER_LINK: &str = "directory_player_link";

pub fn handle_get_my_address() -> ZomeApiResult<Address> {
  
    let _debug_res = hdk::debug("HCH/ handle_get_my_address()");
    Ok(AGENT_ADDRESS.to_string().into())
}

/*
 * Registers the handle and connects it to the anchor
 *
 * @callingType {json}
 * @exposure {public}
 * @param {json} { "Ratee": "<agenthash>" }
 * @return {json}[] {"Result": true, "Entries": ["Rater": "<hash>", "Rating": "<string>"]}
 */
pub fn handle_register(name: String) -> ZomeApiResult<Address> {

    // "Member directory" anchor
    let anchor_entry = Entry::App(
        "anchor".into(),
        RawString::from(PLAYER_DIRECTORY_ANCHOR).into(),
    );

    // TODO: Check if the handle already exists?
    
    // Q: Why creating the anchor here? Perhaps just once? Perhaps in genesis?
    //    Or even in genesis of the application - just the first agent?
    // Link the anchor to the new agent under the "member_tag" tag (?)
    let anchor_address = hdk::commit_entry(&anchor_entry);
    let _link_res = hdk::link_entries(&anchor_address.clone().unwrap(), &AGENT_ADDRESS, DIRECTORY_PLAYER_LINK, "");

    let handle_entry = Entry::App(
        PLAYER_ENTRY_NAME.into(),
        Player { handle: name }.into()
    );

    let handle_addr = hdk::commit_entry(&handle_entry);
    let _link_res = hdk::link_entries(&AGENT_ADDRESS, &handle_addr.clone().unwrap(), PLAYER_FROM_AGENT_LINK, "");

    // Q: When leaving the ...)?; syntax, there were problems, the handle_register function didn't return properly... or perhaps returned too soon, IDK
    // TODO: Find what exactly does the "?" do.

    let _debug_res = hdk::debug(format!("HCH/ handle_register(): handle_addr: {:?}", handle_addr.clone().unwrap()));
    
    // Q: How come in handle_set_handle it works w/o the Ok() wrapping??
    handle_addr
}


pub fn handle_set_handle(handle_string: String) -> ZomeApiResult<Address> {

    let handle = Player { handle: handle_string };
    let handle_entry = Entry::App(PLAYER_ENTRY_NAME.into(), handle.clone().into());    
    let handle_address = hdk::commit_entry(&handle_entry);
    /* {
        // Ok(address) => match hdk::link_entries(&AGENT_ADDRESS, &address, PLAYER_ENTRY_NAME) {
            // Ok(address) => json!({ "address": address }).into(),
            Ok(address) => address,
            Err(hdk_err) => { hdk_err }
        // },
        // Err(hdk_err) => hdk_err.into()
    }; */    
    // let my_key_entry_address = match hdk::get_entry(hdk::entry_address(&my_key_entry)) {
    let _debug_res = hdk::debug(format!("HCH/ handle_set_handle()::_handle: {:?}", handle_address.clone()));
    
    // Q: Still not completely clear on the error handling.
    handle_address
}

// Returns all the handles in the directory
pub fn handle_get_handles() -> ZomeApiResult<JsonString> {
    Ok("[not yet implemented]".into())
}

// Returns the handle of an agent by looking it up on the user's DHT entry, the last handle will be the current one?
pub fn handle_get_handle(_handle: Address) -> ZomeApiResult<JsonString> {
    Ok(Address::new().into())
}

pub fn handle_get_my_handle() -> ZomeApiResult<JsonString> {         
    Ok("[not yet implemented]".into())
}

// Gets the AgentID (userAddress) based on handle
pub fn handle_get_agent(_handle: Address) -> ZomeApiResult<JsonString> {  
    Ok(Address::new().into())
}