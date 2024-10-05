/*
Styles for the PasswordResetModal
*/

import { StyleSheet } from "react-native";

export default StyleSheet.create({
  //Modal styles

  modalView: {
    alignSelf: "stretch",
    backgroundColor: "#e5d5ba",
    marginTop: 150,
    margin: 20,
    padding: 10,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: "#bcbcbc",
  },

  textInputContainer: {
    color: '#000000',
    backgroundColor: '#EFEFEF',
    height: 50,
    width: 280,
    borderRadius: 5,
    paddingLeft: 10,
    borderColor: '#000000',
    borderWidth: '1px'
},






  container: {
    height: 50,
    width: 280,
    borderRadius: 5,
    justifyContent: "flex-start",
    alignItems: "left",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FF0000",
    fontWeight: "600",
    fontSize: 14,
  },
});
