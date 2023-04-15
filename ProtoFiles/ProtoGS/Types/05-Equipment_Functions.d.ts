interface Equipment {
    Name: string;
    Cost: string;
    Weight: string;
    Quantity: string;
    Note?: string;
}
interface EquipmentPack {
    Name: string;
    Cost: string;
    Quantity: string;
    Note: string;
    Contents: Equipment[];
}
declare function equipmentInfo(): {
    "Common Item": Equipment[];
    "Usable Items": Equipment[];
    Clothes: Equipment[];
    "Arcane Focus": Equipment[];
    "Druidic Focus": Equipment[];
    "Holy Symbols": Equipment[];
    Containers: Equipment[];
    Armor: Equipment[];
    Explosives: Equipment[];
    "Firearms (DMG)": Equipment[];
    "Firearms (Exandria)": Equipment[];
    "Tool Set": Equipment[];
    Weapons: Equipment[];
    Ammunition: Equipment[];
    "Equipment Pack": EquipmentPack[];
};
declare function rawInfo(): {
    "Common Item": ({
        Name: string;
        Cost: string;
        Weight: string;
        Quantity: string;
        Note?: undefined;
    } | {
        Name: string;
        Cost: string;
        Weight: string;
        Note: string;
        Quantity: string;
    })[];
    "Usable Items": ({
        Name: string;
        Cost: string;
        Weight: string;
        Note: string;
        Quantity: string;
    } | {
        Name: string;
        Cost: string;
        Weight: string;
        Quantity: string;
        Note?: undefined;
    })[];
    Clothes: {
        Name: string;
        Cost: string;
        Weight: string;
        Quantity: string;
    }[];
    "Arcane Focus": {
        Name: string;
        Cost: string;
        Weight: string;
        Quantity: string;
    }[];
    "Druidic Focus": {
        Name: string;
        Cost: string;
        Weight: string;
        Quantity: string;
    }[];
    "Holy Symbols": {
        Name: string;
        Cost: string;
        Weight: string;
        Quantity: string;
    }[];
    Containers: ({
        Name: string;
        Cost: string;
        Weight: string;
        Note: string;
        Quantity: string;
    } | {
        Name: string;
        Cost: string;
        Weight: string;
        Quantity: string;
        Note?: undefined;
    })[];
    Armor: {
        Name: string;
        Weight: string;
        Cost: string;
        Quantity: string;
    }[];
    Explosives: {
        Name: string;
        Cost: string;
        Weight: string;
        Quantity: string;
    }[];
    "Firearms (DMG)": {
        Name: string;
        Cost: string;
        Weight: string;
        Quantity: string;
    }[];
    "Firearms (Exandria)": {
        Name: string;
        Cost: string;
        Weight: string;
        Quantity: string;
    }[];
    "Tool Set": {
        Name: string;
        Cost: string;
        Weight: string;
        Quantity: string;
    }[];
    Weapons: {
        Name: string;
        Cost: string;
        Weight: string;
        Quantity: string;
    }[];
    Ammunition: {
        Name: string;
        Cost: string;
        Weight: string;
        Quantity: string;
    }[];
};
