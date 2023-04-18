/// <reference path="../ProtoGS/CSCTypes.d.ts"/>

export type CSC = typeof CharacterSheetCode

export type csck = keyof CSC

export type cscReturn<K extends csck> =
	CSC[K] extends (...args: any) => any ?
	ReturnType<CSC[K]> : CSC[K]

export type cscParam<K extends csck> =
	CSC[K] extends (...args: any) => any ?
	Parameters<CSC[K]> : any[]