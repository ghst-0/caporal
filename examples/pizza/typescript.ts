import prog from 'caporal';

prog
    .version('1.0.0')
    // you specify arguments using .argument()
    // 'app' is required, 'env' is optional
    .command('ts', 'Basic typescript example')
    .argument('[arg]', 'argument desc', /^.*$/, 'default arg')
    .option('--option <option>', 'option desc', prog.STRING, 'default option')
    .action((args, options) => {
        console.info('Hello');
        console.info(options);
        console.info("%j", args);
    });


prog.parse(process.argv);
