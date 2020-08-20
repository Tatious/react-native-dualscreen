import { IPaneComponent, paneType, IConfig } from "../../utilities/interfaces";
import { StyleSheet, View, StyleProp, ViewStyle} from "react-native";
import PaneHeaderContainer from "../paneHeaderContainer/PaneHeaderContainer";
import onePane from "../../onePane/onePaneStore/onePane.methods";
import React, { Fragment } from "react";
import twoPane from "../../twoPane/twoPaneStore/twoPane.methods";
import { WindowRect } from "react-native-dualscreeninfo";
import { getUtilityStore } from "../../shared/utilityStore/utilityStore.selectors";

interface IPaneRendererProps {
    prependKey: string;
    paneComponent: IPaneComponent[];
    paneRects: WindowRect[];
}

const PaneRenderer = (props: IPaneRendererProps) => {
    const defaultConfig = getUtilityStore().config;
    const { prependKey, paneComponent, paneRects } = props;

    const isGoBackOne = paneComponent.filter(x => x.pane === paneType.ONE).length > 1;
    const isGoBackTwo = paneComponent.filter(x => x.pane === paneType.TWO).length > 1;
    
    const paneStyling = (_paneType: paneType, _isExtended:boolean, _paneRects: WindowRect[]) => {

        if(_paneType === paneType.TWO && _paneRects.length > 1){
            return Object.assign({},twoPaneStyles(paneRects[1]).twoPane, defaultConfig?.twoPane?.paneBody!)
        } else if (_paneType === paneType.ONE && !_isExtended) {
            return Object.assign({},onePaneStyles(paneRects[0]).onePane, defaultConfig?.onePane?.paneBody!)
        } else if (_paneType === paneType.ONE && _isExtended) {
            return Object.assign({},onePaneStyles(paneRects[0]).extendedPane, defaultConfig?.onePane?.paneBody!)
        }
    }

    return (
        <Fragment>
            {
                paneComponent.map((val: IPaneComponent) =>
                    <View key={prependKey + val.key}
                        style={[generalStyles.container, paneStyling(val.pane,val.isExtended, paneRects)]}>
                        <View style={generalStyles.header}>
                            <PaneHeaderContainer
                                isGoBack={(val.pane === paneType.ONE ? isGoBackOne : isGoBackTwo)}
                                screenHeader={val.header}
                                goBack={() => (val.pane === paneType.ONE ? onePane.GoBack() : twoPane.GoBack())}
                                configDefaultHeader={val.pane === paneType.ONE ? defaultConfig.onePane?.paneHeader! : defaultConfig.twoPane?.paneHeader!}
                            />
                        </View>
                        <View
                            style={generalStyles.body}>
                            {val.paneElement}
                        </View>
                    </View>
                )
            }
        </Fragment >
    )
}

const generalStyles = StyleSheet.create({
    container: {
            flex: 1,
        ...StyleSheet.absoluteFillObject,
        color: 'black'
    },
    header: {
        height: '10%'
    },
    body: {
        height: '85%'
    }
})

const onePaneStyles = (paneRects : WindowRect) => StyleSheet.create({
    onePane: {
        left: paneRects.x,
        height: paneRects.height,
        width: paneRects.width
    },
    extendedPane: {
        left: paneRects.x,
        height: paneRects.height,
        width: paneRects.width * 2
    }
});

const twoPaneStyles = (paneRects : WindowRect) => StyleSheet.create({
    twoPane: {
        left: paneRects.x,
        height: paneRects.height,
        width: paneRects.width,
    },
});

export default PaneRenderer;