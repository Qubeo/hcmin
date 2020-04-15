#![feature(proc_macro_hygiene)]

use hdk::prelude::*;
use hdk_proc_macros::zome;

use hdk::holochain_core_types::{
    time::Iso8601,
};

use hdk::AGENT_ADDRESS;

use crate::pt_promise::PTPromise;
use crate::pt_promise::PTPromiseEntry;

pub mod pt_promise;

// Q: Where's defined the zome name, used for the JSON-RPC API? 
#[zome]
mod pt_promises {

    #[init]
    fn init() {
        Ok(())
    }

    #[validate_agent]
    pub fn validate_agent(validation_data: EntryValidationData<AgentId>) {
        Ok(())
    }

    #[entry_def]
    fn pt_promise_def() -> ValidatingEntryType {
        pt_promise::pt_promise_definition()
    }

    #[zome_fn("hc_public")]
    pub fn list_pt_promises() -> ZomeApiResult<Vec<PTPromise>> {
        pt_promise::handlers::list_pt_promises()
    }

    #[zome_fn("hc_public")]
    fn create_pt_promise(entry: PTPromiseEntry) -> ZomeApiResult<PTPromise> {     
        pt_promise::handlers::create_pt_promise(entry)          // Q: Naming convention. Wouldn't "create" be enough, if namespaced?
    }

    #[zome_fn("hc_public")]
    pub fn get_agent_address() -> ZomeApiResult<Address> {
        Ok(Address::from(AGENT_ADDRESS.to_string()))
    }

    #[zome_fn("hc_public")]
    pub fn get_entry_timestamp(entry_addr: Address) -> ZomeApiResult<Iso8601> {
        pt_promise::timestamp(entry_addr)
    }

    // Distinguish code for the different agents
    // TODO: Create a mermaid diagram
    // AGENT A
    // AGENT B

    #[zome_fn("hc_public")]
    fn get_entry(address: Address) -> ZomeApiResult<Option<Entry>> {
        hdk::get_entry(&address)
    }
}
