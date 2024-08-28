import { createMachine, assign, assertEvent, fromPromise } from "xstate";

function processText(text: string) {
  return Promise.resolve({ data: text.split("\n") });
}

const machine = createMachine(
  {
    id: "input",
    initial: "loading",
    context: {
      data: [],
      text: "",
    },
    types: {} as {
      context: {
        data: any;
        text: string;
      };
      events:
        | { type: "CHANGE_TEXT"; data: string }
        | { type: "PROCESS" }
        | { type: "xstate.done.actor.processing"; output: { data: string[] } };
    },
    states: {
      loading: {
        always: {
          target: "ready",
        },
      },
      ready: {
        on: {
          CHANGE_TEXT: {
            actions: "cacheText",
          },
          PROCESS: {
            target: "processing",
          },
        },
      },
      processing: {
        invoke: {
          id: "processing",
          src: fromPromise(({ input }) => processText(input.text)),
          input: ({ context }) => ({
            text: context.text,
          }),
          onDone: { actions: "cacheProcessedText", target: "processed" },
        },
      },
      processed: {},
    },
  },
  {
    actions: {
      cacheText: assign(({ event }) => {
        assertEvent(event, "CHANGE_TEXT");
        return {
          text: event.data,
        };
      }),
      cacheProcessedText: assign(({ event }) => {
        assertEvent(event, "xstate.done.actor.processing");

        return {
          data: event.output.data,
        };
      }),
    },
  }
);

export default machine;
