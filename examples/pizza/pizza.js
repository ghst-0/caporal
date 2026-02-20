import prog from 'caporal';

prog
  .version('1.0.0')
  // the "order" command
  .help(`My Custom help !!`)
  .command('order', 'Order a pizza')
  .help(`My Custom help about the order command !!`)
  .alias('give-it-to-me')
  // <kind> will be auto-magicaly autocompleted by providing the user with 3 choices
  .argument('<kind>', 'Kind of pizza', ["margherita", "hawaiian", "fredo"])
  .argument('<from-store>', 'Which store to order from')
  // enable auto-completion for <from-store> argument using a sync function returning an array
  .complete(() => {
    return ['store-1', 'store-2', 'store-3', 'store-4', 'store-5'];
  })

  .argument('<account>', 'Which account id to use')
  // enable auto-completion for <account> argument using a Promise
  .complete(() => {
    return Promise.resolve(['account-1', 'account-2']);
  })

  .option('-n, --number <num>', 'Number of pizza', prog.INT, 1)
  .option('-d, --discount <amount>', 'Discount offer', prog.FLOAT)
  .option('-p, --pay-by <mean>', 'Pay by option')
  // enable auto-completion for -p | --pay-by argument using a Promise
  .complete(() => {
    return Promise.resolve(['cash', 'credit-card']);
  })

  // --extra will be auto-magicaly autocompleted by providing the user with 3 choices
  .option('-e <ingredients>', 'Add extra ingredients', ['pepperoni', 'onion', 'cheese'])
  .option('--add-ingredients <ingredients>', 'Add extra ingredients', prog.LIST)
  .action((args, options) => {
    console.info("Command 'order' called with:");
    console.info("arguments: %j", args);
    console.info("options: %j", options);
  })



  // the "return" command
  .command('return', 'Return an order')
  // <kind> will be auto-magicaly autocompleted by providing the user with 3 choices
  .argument('<order-id>', 'Order id')
  // enable auto-completion for <from-store> argument using a Promise
  .complete(() => {
    return Promise.resolve(['#82792', '#71727', '#526Z52']);
  })
  .argument('<to-store>', 'Store id')
  .option('--ask-change <other-kind-pizza>', 'Ask for other kind of pizza')
  .complete(() => {
    return Promise.resolve(["margherita", "hawaiian", "fredo"]);
  })
  .option('--say-something <something>', 'Say something to the manager')
  .action((args, options) => {
    return Promise.resolve("wooooo").then((ret) => {
      console.info("Command 'return' called with:");
      console.info("arguments: %j", args);
      console.info("options: %j", options);
      console.info("promise succeed with: %s", ret);
    });
  });

prog.parse(process.argv);
