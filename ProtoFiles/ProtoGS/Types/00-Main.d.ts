/// <reference types="google-apps-script" />
declare const libraryVersion = "v3.7.1"
declare const deploymentVersion = 39
declare function version(i: GoogleAppsScript.Events.SheetsOnOpen): void
declare function trigger(e: GoogleAppsScript.Events.SheetsOnEdit, id?: string): void
declare function preload(i: GoogleAppsScript.Events.SheetsOnOpen, id?: string): void
