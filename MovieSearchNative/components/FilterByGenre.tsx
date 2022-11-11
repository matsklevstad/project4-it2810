import { View, Text, StyleSheet } from "react-native";
import React from "react";
import SelectDropdown from "react-native-select-dropdown";

export default function FilterByGenre() {
  let selectedItemGlobal = "";

  const genresList = [
    "Drama",
    "War",
    "Action",
    "Comedy",
    "Crime",
    "History",
    "Thriller",
    "Sci-Fi",
    "Fantasy",
    "Family",
    "Music",
  ];

  return (
    <View>
      <SelectDropdown
        selectedRowStyle={styles.selectedRow}
        rowStyle={styles.row}
        buttonStyle={styles.filterButton}
        data={genresList}
        defaultButtonText={"Select genre"}
        onSelect={(selectedItem, index) => {
          // Handle select
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          selectedItemGlobal = selectedItem;
          return selectedItem + " \u2713";
        }}
        rowTextForSelection={(item, index) => {
          if (item === selectedItemGlobal) {
            return item + " \u2713";
          } else {
            return item;
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  selectedRow: {
    backgroundColor: "lightgrey",
  },
  row: {
    backgroundColor: "white",
  },
  filterButton: {
    backgroundColor: "white",
    marginLeft: "auto",
    marginRight: 20,
    marginTop: 5,
    height: 40,
    width: 140,
  },
});
