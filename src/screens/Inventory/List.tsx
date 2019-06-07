import React, { Props } from 'react'
import {
    View,
    Text,
    Button,
    TouchableHighlight,
    SafeAreaView,
    FlatList
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet';
import { defaultScreenOptions } from '../../utils/navigation';
import { Navigation } from 'react-native-navigation';
import InventoryEntryFactory from '../../factories/InventoryEntryFactory';
import InventorySessionFactory from '../../factories/InventorySessionFactory';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from '../../styles/material';
import InventoryEntry from '../../entities/InventoryEntry';
import InventorySession from '../../entities/InventorySession';

export interface InventoryListProps {
    componentId: string;
    item: InventorySession;
}

interface InventoryListState {
    inventoriesData: InventorySessionListItem[];
}

interface InventorySessionListItem {
    key: string,
    id: number,
    title: string,
    subtitle: string,
    detailText: string,
    object: InventorySession
}

interface InventorySessionTapProps {
    componentId: string
    item: InventorySessionListItem
}

export default class InventoryList extends React.Component<InventoryListProps, InventoryListState> {
    constructor(props: InventoryListProps) {
        super(props);
        Navigation.events().bindComponent(this);
        this.state = {
            inventoriesData: []
        }
    }

    static options() {
        var options = defaultScreenOptions("Inventaires");
        // options.topBar.rightButtons = [
        //     {
        //         id: 'inventory-new',
        //         text: 'Nouveau'
        //     }
        // ]

        return options;
    }

    componentDidAppear() {
        this.loadData();
    }

    componentDidMount() {
        // this.loadData();
    }

    loadData() {
        InventorySessionFactory.sharedInstance().findAll().then(async inventories => {
            const inventoriesData = [];
            for (const k in inventories) {
                const inventory = inventories[k];
                const inventoryEntries = await InventoryEntryFactory.sharedInstance().findForInventorySession(inventory);

                let articleCountString;
                if (inventoryEntries.length == 0) {
                    articleCountString = "aucun article";
                } else {
                    articleCountString = inventoryEntries.length + " article" + (inventories.length > 1 ? "s" : "");
                }
                const inventoryData: InventorySessionListItem = {
                    key: 'inventory-' + inventory.id,
                    id: inventory.id ? inventory.id : 0,
                    title: inventory.date?inventory.date.format('DD MMMM YYYY à HH[h]mm'):"",
                    subtitle: "Zone "+String(inventory.zone)+" - "+articleCountString,
                    detailText: "",
                    object: inventory
                }
                inventoriesData.push(inventoryData);
            }

            this.setState({
                inventoriesData: inventoriesData
            })
        });
    }

    openNewInventoryModal() {
        Navigation.showModal({
            stack: {
                children: [{
                    component: {
                        name: 'Inventory/New'
                    }
                }]
            }
        });
    }

    navigationButtonPressed({ buttonId }) {
        // will be called when "buttonOne" is clicked
        if (buttonId === 'inventory-new') {
            this.openNewInventoryModal();
        }
    }

    didTapInventoryEntry = (props: InventorySessionTapProps) => {
        Navigation.push(props.componentId, {
            component: {
                name: 'Inventory/Show',
                passProps: {
                    inventorySessionId: props.item.id
                }
            }
        });
    }

    render() {
        return (
            <SafeAreaView>
                <View style={{padding: 8, flexDirection: 'row', justifyContent: 'center'}}>
                    <Icon.Button 
                        name="plus-circle"
                        solid
                        style={{}}
                        onPress={this.openNewInventoryModal}
                    >Nouvel inventaire</Icon.Button>
                </View>
                <FlatList
                    style={{ backgroundColor: 'white' }}
                    data={this.state.inventoriesData}
                    renderItem={({ item }) =>
                        <TouchableHighlight
                            onPress={() => {
                                let inventorySessionTapProps: InventorySessionTapProps = {
                                    componentId: this.props.componentId,
                                    item: item
                                }
                                this.didTapInventoryEntry(inventorySessionTapProps)
                            }}
                            underlayColor="#BCBCBC"
                        >
                            <View style={styles.row}>
                                <Icon name="clipboard" style={styles.rowIcon} />
                                <View style={styles.rowContent}>
                                    <Text style={styles.rowTitle}>{item.title}</Text>
                                    <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
                                </View>
                                <Text style={styles.rowDetailText}>{item.detailText}</Text>
                                <Icon name="info-circle" style={styles.rowActionIcon} />
                            </View>
                        </TouchableHighlight>
                    }
                />
            </SafeAreaView>
        )
    }
}