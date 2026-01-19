import { useState } from "react";
import { View, Text, Pressable, useColorScheme } from "react-native";
import * as AC from "@bacons/apple-colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CalculatorRoute() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const scheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const isDark = scheme === "dark";

  const handleNumberPress = (num: string) => {
    if (shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleOperationPress = (op: string) => {
    const currentValue = parseFloat(display);

    if (previousValue !== null && operation && !shouldResetDisplay) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    } else {
      setPreviousValue(currentValue);
    }

    setOperation(op);
    setShouldResetDisplay(true);
  };

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case "+":
        return prev + current;
      case "-":
        return prev - current;
      case "×":
        return prev * current;
      case "÷":
        return prev / current;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    if (previousValue !== null && operation) {
      const currentValue = parseFloat(display);
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setShouldResetDisplay(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
  };

  const handleDecimal = () => {
    if (shouldResetDisplay) {
      setDisplay("0.");
      setShouldResetDisplay(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handlePlusMinus = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  };

  const handlePercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const renderButton = (
    label: string,
    onPress: () => void,
    variant: "number" | "operation" | "special" | "equals" = "number",
    isWide: boolean = false
  ) => {
    let backgroundColor: string;
    let textColor: string;

    switch (variant) {
      case "operation":
        backgroundColor = AC.systemOrange;
        textColor = "white";
        break;
      case "special":
        backgroundColor = isDark ? "#505050" : "#D4D4D2";
        textColor = isDark ? "white" : "black";
        break;
      case "equals":
        backgroundColor = AC.systemOrange;
        textColor = "white";
        break;
      default:
        backgroundColor = isDark ? "#333333" : "#E8E8E8";
        textColor = isDark ? "white" : "black";
    }

    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          backgroundColor,
          opacity: pressed ? 0.7 : 1,
          height: 80,
          borderRadius: 40,
          alignItems: "center",
          justifyContent: "center",
          flex: isWide ? 2 : 1,
        })}
      >
        <Text
          style={{
            color: textColor,
            fontSize: 32,
            fontWeight: "400",
          }}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? "black" : "white",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: 20,
        paddingRight: 20,
      }}
    >
      <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 20 }}>
        <Text
          selectable
          style={{
            color: isDark ? "white" : "black",
            fontSize: 80,
            fontWeight: "200",
            textAlign: "right",
            fontVariant: ["tabular-nums"],
          }}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {display}
        </Text>
      </View>

      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          {renderButton("AC", handleClear, "special")}
          {renderButton("±", handlePlusMinus, "special")}
          {renderButton("%", handlePercent, "special")}
          {renderButton("÷", () => handleOperationPress("÷"), "operation")}
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          {renderButton("7", () => handleNumberPress("7"))}
          {renderButton("8", () => handleNumberPress("8"))}
          {renderButton("9", () => handleNumberPress("9"))}
          {renderButton("×", () => handleOperationPress("×"), "operation")}
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          {renderButton("4", () => handleNumberPress("4"))}
          {renderButton("5", () => handleNumberPress("5"))}
          {renderButton("6", () => handleNumberPress("6"))}
          {renderButton("-", () => handleOperationPress("-"), "operation")}
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          {renderButton("1", () => handleNumberPress("1"))}
          {renderButton("2", () => handleNumberPress("2"))}
          {renderButton("3", () => handleNumberPress("3"))}
          {renderButton("+", () => handleOperationPress("+"), "operation")}
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          {renderButton("0", () => handleNumberPress("0"), "number", true)}
          {renderButton(".", handleDecimal)}
          {renderButton("=", handleEquals, "equals")}
        </View>
      </View>
    </View>
  );
}
