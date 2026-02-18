declare class Caporal {
    INTEGER: number;
    INT: number;
    FLOAT: number;
    BOOL: number;
    BOOLEAN: number;
    STRING: number;
    LIST: number;
    ARRAY: number;
    REPEATABLE: number;
    REQUIRED: number;

    version(ver: string): Caporal;
    version(): string;

    name(name: string): Caporal;
    name(): string;

    description(name: string): Caporal;
    description(): string;

    bin(name: string): Caporal;
    bin(): string;

    help(helpText: string, helpOptions?: helpOptions): Caporal;

    command(synopsis: string, description: string): Command;

    action(cb: ActionCallback): Caporal;

    option(synopsis: string, description: string, validator?: ValidatorArg, defaultValue?: any, required?: boolean): Caporal;

    argument(synopsis: string, description: string, validator?: ValidatorArg, defaultValue?: any): Command;

    parse(argv: string[]): any;
    fatalError(error: Error): void;
}

type helpOptions = {
    indent?: boolean,
    name?: string
};

type ActionCallback = (args: { [k: string]: any },
                       options: { [k: string]: any }
                       ) => void;

type ValidatorArg = string[]|string|RegExp|ValidatorFn|Number;
type ValidatorFn = (str: string) => any;

declare interface Command {
    help(helpText: string, helpOptions?: helpOptions): Command;

    argument(synopsis: string, description: string, validator?: ValidatorArg, defaultValue?: any): Command;

    command(synospis: string, description: string): Command;

    option(synopsis: string, description: string, validator?: ValidatorArg, defaultValue?: any, required?: boolean): Command;

    action(cb: ActionCallback): Command;

    alias(alias: string): Command;

    visible(): boolean;
    visibile(visibility: boolean): Command;
}

declare module 'caporal' {
    const caporal: Caporal;
    export = caporal;
}
