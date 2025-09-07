---
title: 'Setting Up Protocol Buffer Compilation with Bazel and Rust: A Custom Approach'
description: 'How to build a custom proto compilation pipeline when the official rules_rust documentation no longer works with modern tonic versions'
pubDate: 'Jan 07 2025'
heroImage: '../../assets/blog-placeholder-4.jpg'
---

In this post, I'll explain how we set up Protocol Buffer compilation in our Rust project using Bazel, and why we had to build a custom solution.

## The Problem with Official Documentation

The official rules_rust documentation for rust_prost (https://bazelbuild.github.io/rules_rust/rust_prost.html) unfortunately no longer works with recent versions of tonic. The toolchain setup and proto compilation rules are incompatible with the current tonic API and dependencies, leading to compilation errors and version conflicts.

This forced us to create our own solution that works reliably with modern versions of both prost and tonic.

## Our Custom Solution

We built a three-part system in the `proto/` folder:

### 1. Custom Compiler Binary

Instead of relying on rules_rust's prost toolchain, we created our own compiler:

```rust
// proto/src/main.rs
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let out_dir = std::env::var("OUT_DIR")?;
    std::fs::create_dir_all(&out_dir)?;

    tonic_prost_build::configure()
        .out_dir(&out_dir)
        .compile_protos(&["./protos/hello.proto"], &["./protos"])?;

    for entry in std::fs::read_dir(&out_dir)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_file() {
            println!("File: {}", path.display());
        }
    }

    Ok(())
}
```

This compiler:
- Reads the `OUT_DIR` environment variable to determine where to generate code
- Uses `tonic_prost_build` directly to compile proto files
- Generates both message structs and gRPC service traits
- Lists generated files for debugging purposes

### 2. Bazel Build Configuration

The BUILD.bazel file in the proto folder orchestrates the compilation:

```starlark
rust_binary(
    name = "compiler",
    srcs = ["src/main.rs"],
    deps = ["@crates//:tonic-prost-build"],
)

genrule(
    name = "protos",
    srcs = glob(["protos/*.proto"]),
    outs = ["generated/hello.rs"],
    cmd = 'export COMPILER="$$PWD/$(location :compiler)"; '
          'export OUT_DIR=$$PWD/$$(dirname $(location :generated/hello.rs)); '
          'cd proto; $$COMPILER',
    tools = [":compiler"],
)

rust_library(
    name = "proto",
    srcs = [":generated/hello.rs"],
    crate_name = "umka_proto",
    deps = [
        "@crates//:prost",
        "@crates//:tonic",
    ],
)
```

### 3. Why This Approach Works

Our custom solution has several advantages:

1. **Version Compatibility**: We control the exact versions of prost and tonic through Cargo.toml
2. **Simplicity**: No complex toolchain configuration needed
3. **Flexibility**: Easy to customize the compilation process
4. **Reliability**: Direct use of tonic_prost_build API ensures compatibility

## The Key Insight

The critical part is using a `genrule` to run our custom compiler binary. This gives us full control over:
- Environment variables passed to the compiler
- Working directory during compilation
- Output file locations
- Dependencies and rebuilding logic

## Usage in the Project

Once compiled, the generated proto code integrates seamlessly:

```rust
use umka_proto::hello_service_server::HelloService;
use umka_proto::{HelloRequest, HelloResponse};

#[tonic::async_trait]
impl HelloService for MyService {
    async fn say_hello(
        &self,
        request: Request<HelloRequest>,
    ) -> Result<Response<HelloResponse>, Status> {
        // Implementation
    }
}
```

## Lessons Learned

1. **Don't Fight the Tools**: When official integrations break, building a custom solution can be simpler than trying to fix version conflicts
2. **Keep It Simple**: Our entire compiler is under 20 lines of code
3. **Leverage Bazel's Flexibility**: `genrule` is powerful enough to integrate any code generation tool
4. **Document Your Decisions**: Future maintainers need to understand why we diverged from official documentation

## Conclusion

While it would be ideal if the official rules_rust proto support worked out of the box, our custom solution is actually quite elegant. It's explicit, maintainable, and gives us complete control over the proto compilation process. Sometimes, the best solution is the one you build yourself.