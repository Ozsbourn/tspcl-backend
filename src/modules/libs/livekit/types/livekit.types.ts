import { FactoryProvider, ModuleMetadata } from "@nestjs/common";

export const LiveKitOptionsSymbol = Symbol('LiveKitOptionsSymbol');

export type TypeLiveKitOptions = {
	apiUrl: string;
	apiKey: string;
	apicSecret: string;
};

export type TypeLiveKitAsyncOptions = Pick<ModuleMetadata, 'imports'> & Pick<FactoryProvider<TypeLiveKitOptions>, 'useFactory' | 'inject'>;