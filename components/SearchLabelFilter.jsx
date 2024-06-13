import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-remix-icon";
import { colors } from "../utils/constant";

const SearchLabelFilter = ({ name, value, filterSearch, setFilterSearch }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={` ${
        filterSearch === value ? "bg-Primary01" : "bg-bgColor"
      } rounded-full h-[50px] px-4 flex-row items-center py-3 transition-all ease-in-out duration-100`}
      onPress={() => {
        if (filterSearch === value) {
          setFilterSearch("");
        } else {
          setFilterSearch(value);
        }
      }}
    >
      <Text
        className={`text-sm ${
          filterSearch === value ? " text-white" : "text-text"
        } font-primary mr-2 transition-all ease-in-out duration-100`}
      >
        {name}
      </Text>
      {!(filterSearch === value) ? (
        <Icon name="add-line" size={20} color={colors.text} />
      ) : (
        <Icon name="close-line" size={20} color={"#fff"} />
      )}
    </TouchableOpacity>
  );
};

export default SearchLabelFilter;

const styles = StyleSheet.create({});
