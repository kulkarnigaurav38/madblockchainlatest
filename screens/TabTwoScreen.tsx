import React from "react";
import axios from "axios";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

export default function TabTwoScreen() {
  let jsonres = "";
  let balance = 0.0;
  const [transactionID, setTransactionID] = React.useState("");
  const etherscanAPItransactionID = () => {
    axios
      .get("https://api-ropsten.etherscan.io/api", {
        params: {
          module: "proxy",
          action: "eth_getTransactionByHash",
          txhash: transactionID,
          apikey: "5Y34WF54H6X26G4EDTRIZAWFT2E5NVWWIG",
        },
      })
      .then(function (response) {
        jsonres = JSON.stringify(response.data.result.from);
        console.log(jsonres);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const etherscanAPIbalance = () => {
    axios
      .get("https://api-ropsten.etherscan.io/api", {
        params: {
          module: "account",
          action: "balancemulti",
          address: "0x09b8f52555d0070c0e6a68564644234b5e7c0322",
          tag: "latest",
          apikey: "5Y34WF54H6X26G4EDTRIZAWFT2E5NVWWIG",
        },
      })
      .then(function (response) {
        balance =
          parseInt(JSON.stringify(response.data.result.balance)) /
          1000000000000000000;
        console.log(JSON.stringify(response));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const submit = () => {
    etherscanAPItransactionID();
    etherscanAPIbalance();
  };
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabTwoScreen.tsx" /> */}
      <TextInput
        style={styles.input}
        onChangeText={setTransactionID}
        value={transactionID}
        placeholder="Enter the Transaction Hash/ID"
        placeholderTextColor={"#FFF"}
      />
      {/* <TextInput
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
      /> */}

      {/* <Text>{shortenAddress(connector.accounts[0])}</Text> */}
      <TouchableOpacity onPress={submit} style={styles.buttonStyle}>
        <Text style={styles.buttonTextStyle}>Submit</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={killSession} style={styles.buttonStyle}>
        <Text style={styles.buttonTextStyle}>Log out</Text>
      </TouchableOpacity> */}
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
