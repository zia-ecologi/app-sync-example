import { query as q, Client, Documents, Collection } from "faunadb";
import { object, string } from "yup";
import {
  QueryUsersArgs,
  MutationUpdateUserArgs,
  User,
  Customer,
  MutationUpdateCustomerArgs,
} from "./graphql";
import { Event, Callback, FaunaListResult, FaunaResult } from "./types";
import { handlerFn } from "./lib";
import { FAUNADB_SECRET } from "./env";

const client = new Client({
  secret: FAUNADB_SECRET,
});

const customers = handlerFn<undefined, Customer[]>(async () => {
  const allUsers: FaunaListResult<Customer> = await client.query(
    q.Map(
      q.Paginate(Documents(Collection("customers"))),
      q.Lambda((x) => q.Get(x))
    )
  );

  return allUsers.data.map(({ data, ref }) => ({ ...data, id: ref.id }));
});

const customerInputSchema = object().shape({
  firstName: string().min(2).optional(),
  lastName: string().min(2).optional(),
  address: object().shape({
    street: string().min(1).max(100).optional(),
    city: string().min(1).max(100).optional(),
    state: string().min(1).max(100).optional(),
    zipCode: string().min(3).max(16).optional(),
  }),
  telephone: string().min(5).max(40).optional(),
  creditCard: object().shape({
    network: string().min(5).max(40).optional(),
    number: string().min(3).max(20).optional(),
  }),
});

const updateCustomer = handlerFn<MutationUpdateCustomerArgs, Customer>(
  async (event) => {
    await customerInputSchema.validate(event.arguments.data);

    const result: FaunaResult<Customer> = await client.query(
      q.Update(q.Ref(q.Collection("customers"), event.arguments.id), {
        data: event.arguments.data,
      })
    );

    return result.data;
  }
);

const mockUser = {
  name: "dkdkjd",
  id: "123",
  description: "dskj",
};

const users = async (
  event: Event<QueryUsersArgs>,
  callback: Callback<User>
) => {
  callback(null, mockUser);
};

const updateUser = (
  event: Event<MutationUpdateUserArgs>,
  callback: Callback<User>
) => {
  callback(null, mockUser);
};

const handlers = {
  users,
  updateUser,
  customers,
  updateCustomer,
};

export const graphqlHandler = (
  event: Event<any>,
  context,
  callback: Callback<any>
) => {
  console.log("Received event {}", JSON.stringify(event));

  (async () => {
    const handler = handlers[event.field];

    handler
      ? await handler(event, callback)
      : callback(`Unknown field, unable to resolve ${event.field}`, null);
  })();
};
