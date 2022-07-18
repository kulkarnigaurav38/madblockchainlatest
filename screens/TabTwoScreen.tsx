import React from "react";
import axios from "axios";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Text, View } from "../components/Themed";

let someobj = {
  jsonres: "",
  jsonres2: "",
  balance: 0.0,
  balance2: 0.0,
};
export default function TabTwoScreen() {
  const [flag, setFlag] = React.useState(false);
  React.useEffect(() => {}, [flag]);
  const [transactionID, setTransactionID] = React.useState("");

  const etherscanAPItransactionID = (someobj: {
    jsonres: any;
    jsonres2: any;
    balance: any;
    balance2: any;
  }) => {
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
        someobj.jsonres = JSON.stringify(response.data.result.from);
        someobj.jsonres2 = JSON.stringify(response.data.result.to);
        console.log(someobj.jsonres);
        console.log(someobj.jsonres2);
      })
      .catch(function (error) {
        console.log(error);
      });
    setTimeout(
      () => {
        axios
          .get("https://api-ropsten.etherscan.io/api", {
            params: {
              module: "account",
              action: "balancemulti",
              address: JSON.parse(someobj.jsonres),
              tag: "latest",
              apikey: "5Y34WF54H6X26G4EDTRIZAWFT2E5NVWWIG",
            },
          })
          .then(function (response) {
            someobj.balance =
              parseInt(response.data.result[0].balance) / 1000000000000000000;

            console.log(someobj.balance);
          })
          .catch(function (error) {
            console.log(error);
          });
        axios
          .get("https://api-ropsten.etherscan.io/api", {
            params: {
              module: "account",
              action: "balancemulti",
              address: JSON.parse(someobj.jsonres2),
              tag: "latest",
              apikey: "5Y34WF54H6X26G4EDTRIZAWFT2E5NVWWIG",
            },
          })
          .then(function (response) {
            someobj.balance2 =
              parseInt(response.data.result[0].balance) / 1000000000000000000;
            console.log(someobj.balance2);
            setTimeout(() => {
              setFlag(true);
            }, 2000);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      500,
      someobj
    );
  };

  const submit = () => {
    etherscanAPItransactionID(someobj);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setTransactionID}
        value={transactionID}
        placeholder="Enter the Transaction Hash/ID"
        placeholderTextColor={"#FFF"}
      />

      <TouchableOpacity onPress={submit} style={styles.buttonStyle}>
        <Text style={styles.buttonTextStyle}>Submit</Text>
      </TouchableOpacity>
      {flag && (
        <>
          {console.log(someobj)}
          <Text style={styles.title}>
            Wallet 1 (From) Address : {someobj.jsonres}
          </Text>
          <Text style={styles.title}>
            Wallet 2 (To) Address : {someobj.jsonres2}
          </Text>
          <Text style={styles.title}>
            Balance in Wallet 1 (From): {someobj.balance}
          </Text>
          <Text style={styles.title}>
            Balance in Wallet 2 (To): {someobj.balance2}
          </Text>
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
