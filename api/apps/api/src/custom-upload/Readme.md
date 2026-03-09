## Install dependencies

- ```yarn add graphql-upload@^13.0.0```
- ```yarn add -D @types/graphql-upload@^8.0.0```

## Setup

### main.ts

- import graphqlUploadExpress
  - ```import { graphqlUploadExpress } from 'graphql-upload';```
- use graphqlUploadExpress in bootstrap function
  - ```app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 5 }));```
  
### GqlConfig

```ts
createGqlOptions(): ApolloDriverConfig {
  return {
    ...
    resolvers: {
      ...customUploadResolver,
    },
  }
}
```

### DTO

```ts
@InputType()
export class FileUploadInput {

  // Single File
  @Field(() => CustomUploadScalar)
  @IsNotEmpty()
  @Validate(IsFileType, IsFileType.params({ validTypes: ['video/mp4'] }))
  @Validate(IsFileSize, IsFileSize.params({ maxSize: 20 }))
  newFile: Promise<CustomUpload>;

  // Multiple Files
  @Field(() => [CustomUploadScalar])
  @IsNotEmpty()
  @Validate(IsFileType, IsFileType.params({ validTypes: ['video/mp4'] }), {
    each: true,
  })
  @Validate(IsFileSize, IsFileSize.params({ maxSize: 20 }), { each: true })
  newFiles: Promise<CustomUpload>[];
}
```

### Resolver

```ts
@Resolver(() => TestMutation)
export class TransliterationMutationResolver {
  @Mutation(() => TestMutation)
  async test() {
    return {};
  }

  @ResolveField(() => Boolean)
  async fileUpload(@Args('input') input: FileUploadInput): Promise<boolean> {
    // Single File
    const singleFile = await input.newFile;

    // Multiple Files
    cosnt multipleFiles = await Promise.all(input.newFiles)
    
    return true;
  }
}
```
