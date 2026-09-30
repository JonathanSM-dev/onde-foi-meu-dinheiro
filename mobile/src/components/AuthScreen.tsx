import { useState } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { Screen, Field, Button, Notice } from "./ui";
import { useApp } from "../state/AppProvider";
import { styles as s } from "../theme";
export function AuthScreen({ register = false }: { register?: boolean }) {
  const { enter } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const submit = () => {
    if (
      (register && !name.trim()) ||
      !/^\S+@\S+\.\S+$/.test(email) ||
      password.length < 6 ||
      (register && password !== confirmation)
    ) {
      setError(
        "Confira nome, e-mail e senha de pelo menos 6 caracteres. A confirmação deve ser igual.",
      );
      return;
    }
    setPassword("");
    setConfirmation("");
    enter(name || "Alex");
    router.replace("/(privado)/(tabs)");
  };
  return (
    <Screen
      title={register ? "Um novo começo." : "Seu dinheiro,\ncom mais clareza."}
      subtitle="Menos planilha. Mais vida."
    >
      <View style={s.hero}>
        <Text style={s.heroText}>Um registro de cada vez.</Text>
        <Text style={s.heroLabel}>
          Entenda seus gastos sem complicar sua rotina.
        </Text>
      </View>
      <Notice>
        Etapa 2 · acesso demonstrativo. Use dados fictícios. Não há autenticação
        real e nenhuma senha é salva.
      </Notice>
      {register && (
        <Field
          label="Seu nome"
          value={name}
          onChangeText={setName}
          maxLength={50}
        />
      )}
      <Field
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="off"
        placeholder="alex@exemplo.com"
      />
      <Field
        label="Senha demonstrativa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="off"
      />
      {register && (
        <Field
          label="Confirmar senha"
          value={confirmation}
          onChangeText={setConfirmation}
          secureTextEntry
        />
      )}
      {!!error && <Notice error>{error}</Notice>}
      <Button
        title={
          register ? "Criar perfil demonstrativo" : "Entrar na demonstração"
        }
        onPress={submit}
      />
      <Button
        title="Explorar como Alex"
        secondary
        onPress={() => {
          enter("Alex");
          router.replace("/(privado)/(tabs)");
        }}
      />
      <Button
        title={register ? "Já tenho acesso" : "Criar perfil"}
        secondary
        onPress={() => router.replace(register ? "/login" : "/cadastro")}
      />
    </Screen>
  );
}
