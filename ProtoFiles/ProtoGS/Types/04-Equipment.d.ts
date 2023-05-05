declare const EquipmentInfo: {
	"Common Item": Equipment[]
	"Usable Items": Equipment[]
	Clothes: Equipment[]
	"Arcane Focus": Equipment[]
	"Druidic Focus": Equipment[]
	"Holy Symbols": Equipment[]
	Containers: Equipment[]
	Armor: Equipment[]
	Explosives: Equipment[]
	"Firearms (DMG)": Equipment[]
	"Firearms (Exandria)": Equipment[]
	"Tool Set": Equipment[]
	Weapons: Equipment[]
	Ammunition: Equipment[]
	"Equipment Pack": EquipmentPack[]
}
declare function setEquipment(category: keyof typeof EquipmentInfo, name: string): string
