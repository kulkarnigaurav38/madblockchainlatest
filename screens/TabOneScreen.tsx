import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
} from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

import { useWalletConnect } from "@walletconnect/react-native-dapp";
let value = "";
const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
};

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const connector = useWalletConnect();
  const [address, setAddress] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [amount, setAmount] = React.useState("");

  React.useEffect(() => {
    console.log(address, message, amount);
    const numamount = Number(amount) * 1000000000000000000;
    value = numamount.toString();
  }, [address, message, amount]);

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);

  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);

  const requestEth = React.useCallback(async () => {
    try {
      await connector.sendTransaction({
        data: message,
        from: `${connector.accounts}`,
        gasPrice: "0x0ee40be400", // Optional
        gas: "0xeed9",
        to: address,
        value: value,
      });

      ToastAndroid.showWithGravityAndOffset(
        "Transaction completed successfully",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } catch (e) {
      console.error(e);
    }
  }, [connector]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {!connector.connected && (
        <TouchableOpacity onPress={connectWallet} style={styles.buttonStyle}>
          <Text style={styles.buttonTextStyle}>Connect a Wallet</Text>
        </TouchableOpacity>
      )}
      {connector.connected && (
        <>
          <TextInput
            style={styles.input}
            onChangeText={setAddress}
            value={address}
            placeholder="Enter the wallet address"
            placeholderTextColor={"#FFF"}
          />
          <TextInput
            style={styles.input}
            onChangeText={setAmount}
            value={amount}
            placeholder="Enter the amount (eth)"
            keyboardType="numeric"
            placeholderTextColor={"#FFF"}
          />
          <TextInput
            style={styles.input}
            onChangeText={setMessage}
            value={message}
            placeholder="Enter a message"
            placeholderTextColor={"#FFF"}
          />

          <Text>{shortenAddress(connector.accounts[0])}</Text>
          <TouchableOpacity onPress={requestEth} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={killSession} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Log out</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  buttonStyle: {
    backgroundColor: "#3399FF",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#3399FF",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    color: "#FFF",
    width: 250,
  },
});
