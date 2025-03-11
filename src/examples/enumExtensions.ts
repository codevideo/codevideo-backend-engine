import { IAction } from "@fullstackcraftllc/codevideo-types";

const enumExtensionsActions: Array<IAction> = [
  {
    name: "author-speak-before",
    value:
      "In this article, we'll explore how to enhance your C# enums with two useful extensions in a generic manner.",
  },
  {
    name: "editor-type",
    value: "public static class EnumExtensions {\n\n}",
  },
  {
    name: "author-speak-before",
    value:
      "Let's begin by creating the first functionality - obtaining a human-readable representation of enum values.",
  },
  {
    name: "editor-arrow-down",
    value: "2",
  },
  {
    name: "editor-type",
    value:
      "public static string GetDescriptionFromAttribute(this Enum value) {\n\n}",
  },
  {
    name: "editor-arrow-down",
    value: "3",
  },
  {
    name: "editor-type",
    value: "  var fieldInfo = value.GetType().GetField(value.ToString());",
  },
  {
    name: "editor-arrow-down",
    value: "1",
  },
  {
    name: "editor-type",
    value: "  if (fieldInfo == null) return value.ToString();",
  },
  {
    name: "editor-arrow-down",
    value: "3",
  },
  {
    name: "editor-type",
    value:
      "  var attributes = (DescriptionAttribute[])fieldInfo.GetCustomAttributes(typeof(DescriptionAttribute), false);",
  },
  {
    name: "editor-arrow-down",
    value: "1",
  },
  {
    name: "editor-type",
    value:
      "  return attributes.Any() ? attributes[0].Description : value.ToString();",
  },
  {
    name: "author-speak-before",
    value:
      "Now, let's move on to the second functionality - parsing a string into an enum value.",
  },
  {
    name: "editor-arrow-down",
    value: "2",
  },
  {
    name: "editor-type",
    value:
      "public static T CustomParse<T>(string? stringValue, T defaultValue) where T : Enum {\n\n}",
  },
  {
    name: "editor-arrow-down",
    value: "2",
  },
  {
    name: "editor-type",
    value: "  if (stringValue == null) return defaultValue;",
  },
  {
    name: "editor-arrow-down",
    value: "3",
  },
  {
    name: "editor-type",
    value: "  var enumType = typeof(T);",
  },
  {
    name: "editor-arrow-down",
    value: "3",
  },
  {
    name: "editor-type",
    value: "  foreach (var fieldInfo in enumType.GetFields()) {\n\n}",
  },
  {
    name: "editor-arrow-down",
    value: "3",
  },
  {
    name: "editor-type",
    value:
      "    var attributes = (DescriptionAttribute[])fieldInfo.GetCustomAttributes(typeof(DescriptionAttribute), false);",
  },
  {
    name: "editor-arrow-down",
    value: "2",
  },
  {
    name: "editor-type",
    value:
      "    if (attributes.Any() && attributes[0].Description == stringValue)",
  },
  {
    name: "editor-arrow-down",
    value: "1",
  },
  {
    name: "editor-type",
    value: "      return (T)fieldInfo.GetValue(null)!;",
  },
  {
    name: "editor-arrow-down",
    value: "2",
  },
  {
    name: "editor-type",
    value:
      "    if (fieldInfo.Name == stringValue) return (T)fieldInfo.GetValue(null)!;",
  },
  {
    name: "editor-arrow-down",
    value: "1",
  },
  {
    name: "editor-type",
    value: "  return defaultValue;",
  },
  {
    name: "author-speak-before",
    value:
      "And that's it! We've successfully created two helpful enum extensions. Happy coding!",
  },
];

export default enumExtensionsActions;