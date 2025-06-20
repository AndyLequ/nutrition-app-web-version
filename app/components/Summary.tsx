import { StyleSheet, Text, View } from 'react-native';


export default function Summary() {
    return (
        <View style={styles.container}>
            <Text>Summary</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})