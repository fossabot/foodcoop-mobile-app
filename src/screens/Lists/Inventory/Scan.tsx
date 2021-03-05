import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { Barcode } from 'react-native-camera';
import Scanner2 from '../../../screens/Scanner2';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { Button } from 'react-native-elements';

export interface Props {
    listId: number;
}

interface State {}

export default class ListsInventoryScan extends React.Component<Props, State> {
    scanner?: Scanner2;
    _panel: SlidingUpPanel | null = null;

    constructor(props: Props) {
        super(props);
    }

    _didScanBarcode = (barcode: Barcode) => {
        this._panel?.show();
    };

    render(): React.ReactElement {
        return (
            <SafeAreaView>
                <Scanner2
                    ref={(ref): void => {
                        this.scanner = ref !== null ? ref : undefined;
                    }}
                    onBarcodeRead={(barcode): void => {
                        this._didScanBarcode(barcode);
                    }}
                >
                    <Button
                        title="Test"
                        onPress={() => {
                            const barcode: Barcode = {
                                bounds: { size: { width: 0, height: 0 }, origin: { x: 0, y: 0 } },
                                data: '1234567890123',
                                dataRaw: '1234567890123',
                                type: 'PRODUCT',
                            };
                            this._didScanBarcode(barcode);
                        }}
                    />
                </Scanner2>
                <SlidingUpPanel ref={c => (this._panel = c)}>
                    <View>
                        <Text>Test</Text>
                    </View>
                </SlidingUpPanel>
            </SafeAreaView>
        );
    }
}
