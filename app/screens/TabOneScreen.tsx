import * as React from "react";
import { StyleSheet } from "react-native";

import { useQuery } from "react-query";
import { request, gql, GraphQLClient } from "graphql-request";

import { Text, View } from "../components/Themed";
import { forkResult } from "./forkResult";

const endpoint = "http://192.168.0.12:20002/graphql";

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZDhjYTUyOC00OTMxLTQyNTQtOTI3My1lYTVlZTg1M2YyNzEiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbS91cy1lYXN0LTFfZmFrZSIsInBob25lX251bWJlcl92ZXJpZmllZCI6dHJ1ZSwiY29nbml0bzp1c2VybmFtZSI6InVzZXIxIiwiYXVkIjoiMmhpZmEwOTZiM2EyNG12bTNwaHNrdWFxaTMiLCJldmVudF9pZCI6ImIxMmEzZTJmLTdhMzYtNDkzYy04NWIzLTIwZDgxOGJkNzhhMSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxOTc0MjY0NDEyLCJwaG9uZV9udW1iZXIiOiIrMTIwNjIwNjIwMTYiLCJleHAiOjE2MTQ4NDg0NTcyLCJpYXQiOjE1NjQyNjQ0MTMsImVtYWlsIjoidXNlckBkb21haW4uY29tIn0.dOCZQE2s3slZjWEbr1QtnuN8li46pc3ru8L2ngrkvXQ",
  },
});

export default function TabOneScreen() {
  const result = useQuery("customers", async () => {
    const {
      posts: { data },
    } = await graphQLClient.request(
      endpoint,
      gql`
        query MyQuery {
          customers {
            firstName
            id
            lastName
          }
        }
      `
    );
    return data;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {forkResult(
        {
          loading: () => <Text>LOADING...</Text>,
          error: (error) => <Text>{JSON.stringify(error)}</Text>,
          data: () => (
            <>
              <Text>DATA</Text>
            </>
          ),
        },
        result
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
});
