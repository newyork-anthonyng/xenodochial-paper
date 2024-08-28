import { createMachine, assign, fromPromise, assertEvent } from "xstate";
import { getVendorsByCode } from "../fetch";

interface DataType {
  accountid: string;
  business_name: string;
  certifications: string[];
  description: string;
  email: string;
  largest_contract_value: string;
  phone: string;
}

const machine = createMachine(
  {
    id: "data",
    initial: "loading",
    context: {
      data: [],
      nigpCodes: ['03123']
    },
    types: {} as {
      context: {
        data: DataType[];
        nigpCodes: string[];
      };
      events:
        | {
            type: "xstate.done.actor.loadData";
            output: { results: DataType[] };
          }
        | { type: "COPY" };
    },
    states: {
      loading: {
        invoke: {
          id: "loadData",
          src: fromPromise(({ input }) => getVendorsByCode(input.nigpCodes)),
          input: ({ context }) => ({
            nigpCodes: context.nigpCodes
          }),
          onDone: {
            target: "ready",
            actions: "cacheData",
          },
          onError: {
            target: "error",
          },
        },
      },
      ready: {
        on: {
          COPY: {
            actions: "copyTable",
          },
        },
      },
      error: {},
    },
  },
  {
    actions: {
      cacheData: assign(({ event }) => {
        assertEvent(event, "xstate.done.actor.loadData");

        console.log(event.output);
        return {
          data: event.output.results,
        };
      }),
    },
  }
);

export default machine;
