import { IAction } from "@fullstackcraftllc/codevideo-types";

export const enumExtensionsActions: Array<IAction> = [
  {
    name: "speak-before",
    value:
      "In this article, we'll explore how to enhance your C# enums with two useful extensions in a generic manner.",
  },
  {
    name: "type-editor",
    value: "public static class EnumExtensions {\n\n}",
  },
  {
    name: "speak-before",
    value:
      "Let's begin by creating the first functionality - obtaining a human-readable representation of enum values.",
  },
  {
    name: "arrow-down",
    value: "2",
  },
  {
    name: "type-editor",
    value:
      "public static string GetDescriptionFromAttribute(this Enum value) {\n\n}",
  },
  {
    name: "arrow-down",
    value: "3",
  },
  {
    name: "type-editor",
    value: "  var fieldInfo = value.GetType().GetField(value.ToString());",
  },
  {
    name: "arrow-down",
    value: "1",
  },
  {
    name: "type-editor",
    value: "  if (fieldInfo == null) return value.ToString();",
  },
  {
    name: "arrow-down",
    value: "3",
  },
  {
    name: "type-editor",
    value:
      "  var attributes = (DescriptionAttribute[])fieldInfo.GetCustomAttributes(typeof(DescriptionAttribute), false);",
  },
  {
    name: "arrow-down",
    value: "1",
  },
  {
    name: "type-editor",
    value:
      "  return attributes.Any() ? attributes[0].Description : value.ToString();",
  },
  {
    name: "speak-before",
    value:
      "Now, let's move on to the second functionality - parsing a string into an enum value.",
  },
  {
    name: "arrow-down",
    value: "2",
  },
  {
    name: "type-editor",
    value:
      "public static T CustomParse<T>(string? stringValue, T defaultValue) where T : Enum {\n\n}",
  },
  {
    name: "arrow-down",
    value: "2",
  },
  {
    name: "type-editor",
    value: "  if (stringValue == null) return defaultValue;",
  },
  {
    name: "arrow-down",
    value: "3",
  },
  {
    name: "type-editor",
    value: "  var enumType = typeof(T);",
  },
  {
    name: "arrow-down",
    value: "3",
  },
  {
    name: "type-editor",
    value: "  foreach (var fieldInfo in enumType.GetFields()) {\n\n}",
  },
  {
    name: "arrow-down",
    value: "3",
  },
  {
    name: "type-editor",
    value:
      "    var attributes = (DescriptionAttribute[])fieldInfo.GetCustomAttributes(typeof(DescriptionAttribute), false);",
  },
  {
    name: "arrow-down",
    value: "2",
  },
  {
    name: "type-editor",
    value:
      "    if (attributes.Any() && attributes[0].Description == stringValue)",
  },
  {
    name: "arrow-down",
    value: "1",
  },
  {
    name: "type-editor",
    value: "      return (T)fieldInfo.GetValue(null)!;",
  },
  {
    name: "arrow-down",
    value: "2",
  },
  {
    name: "type-editor",
    value:
      "    if (fieldInfo.Name == stringValue) return (T)fieldInfo.GetValue(null)!;",
  },
  {
    name: "arrow-down",
    value: "1",
  },
  {
    name: "type-editor",
    value: "  return defaultValue;",
  },
  {
    name: "speak-before",
    value:
      "And that's it! We've successfully created two helpful enum extensions. Happy coding!",
  },
];
