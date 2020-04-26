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
        // time::Timeout,
        // time::Iso8601,
    },
    holochain_json_api::{
        json::JsonString,
        error::JsonError,
    },
    prelude::*,
    // holochain_persistence_api::cas::content::Address
};

pub mod handlers;


// TODO: PlayerHandle? PlayerBook? PlayerID? Player? Is it closer to persona, profile, book, inventory?
// How to modell?
pub const SEED_ENTRY_NAME: &str = "seed";                   // Q: Again, seems redundant.
pub const TOSS_ENTRY_NAME: &str = "toss";
pub const TOSS_RESULT_ENTRY_NAME: &str = "toss_result";

pub const PLAYER_ENTRY_NAME: &str = "player";
pub const PLAYER_TO_AGENT_LINK: &str = "agent_player_link";             // Q: How to work with complementarity? TO-FROM & vice-versa? PT?
pub const PLAYER_FROM_AGENT_LINK: &str = "player_agent_link";
pub const PLAYER_TO_SEED_LINK: &str = "player_seed_link";
// pub const PLAYER_TO_TOSS_LINK: &str = "player_toss_link";
pub const PLAYER_FROM_SEED_LINK: &str = "seed_player_link";           // Q: This seems somewhat (semantically) redundant?
pub const PLAYER_TO_TOSS_RESULT_LINK: &str = "player_toss_result_link";


#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
pub struct Player {
    pub handle: String
}

// Agent / player / member related ---------------------------------------------------------------------
//-----------------------------------------------------------------------------
//                            Entry definitions
//-----------------------------------------------------------------------------

pub fn handle_definition() -> ValidatingEntryType {
        
    // Entry: "handle" for __________? The player? 
    entry!(
        name: PLAYER_ENTRY_NAME,
        description: "",
        sharing: Sharing::Public,
        // native_type: Player,                                // Q: Why does String, or even JsonString not work any more?
        
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },
        
        validation: |_validation_data: hdk::EntryValidationData<Player>| { Ok(()) },
        
        links: [
            to!(
                "%agent_id",
                link_type: PLAYER_TO_AGENT_LINK,

                validation_package: || {
                    hdk::ValidationPackageDefinition::ChainFull
                },

                validation: |_validation_data: hdk::LinkValidationData| {
                    Ok(())
                }
            ),
            from!(
                "%agent_id",
                link_type: PLAYER_FROM_AGENT_LINK,

                validation_package: || {
                    hdk::ValidationPackageDefinition::ChainFull
                },

                validation: |_validation_data: hdk::LinkValidationData| {
                    Ok(())
                }
            ),
            to!(
                "seed",
                link_type: PLAYER_TO_SEED_LINK,       // TODO: Distinguish - the same or different to "seeds" (smwh else)?

                validation_package: || {
                    hdk::ValidationPackageDefinition::ChainFull
                },

                validation: |_validation_data: hdk::LinkValidationData| {
                    Ok(())
                }
            ),
            to!(
                TOSS_RESULT_ENTRY_NAME,
                link_type: PLAYER_TO_TOSS_RESULT_LINK,       // TODO: Distinguish - the same or different to "seeds" (smwh else)?

                validation_package: || {
                    hdk::ValidationPackageDefinition::ChainFull
                },

                validation: |_validation_data: hdk::LinkValidationData| {
                    Ok(())
                }
            )
        ]
    )
} 