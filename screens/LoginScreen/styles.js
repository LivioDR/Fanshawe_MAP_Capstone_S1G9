/*
Styles for the LoginScreen component
*/
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  modalView: {
    alignSelf: "stretch",
    marginTop: 150,
    margin: 20,
    padding: 10,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: "#D3D3D3",
    zIndex: -1,
    alignItems: "center",
  },
  nativeBtn: {

    width: 280,
    paddingLeft: 0,

  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textInputContainer: {
    color: "#000000",
    backgroundColor: "#EFEFEF",
    height: 50,
    width: 280,
    borderRadius: 5,
    paddingLeft: 10,
    borderColor: "#000000",
    borderWidth: "1px",
  },
  footer: {
    position: "absolute",
    paddingBottom: 20,
    bottom: 40,
    zIndex: -2,  //Needed so that outer toast shows above footer
  },
});

export default styles;
