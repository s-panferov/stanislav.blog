---
title: 'Setting up Protocol Buffer compilation with Bazel and Rust'
description: 'How to build a custom proto compilation pipeline when the official rules_rust documentation no longer works with modern tonic versions'
pubDate: 'Sep 01 2025'
heroImage: '../../assets/blog-placeholder-4.jpg'
tags: ['bazel', 'rust', 'protobuf', 'build-systems', 'grpc', 'tonic']
---

In this post, I'll explain how we set up Protocol Buffer compilation in our Rust project using Bazel, and why we had to build a custom solution.

## The Problem with Official Documentation

The official rules_rust documentation for rust_prost (https://bazelbuild.github.io/rules_rust/rust_prost.html) unfortunately no longer works with recent versions of tonic. The toolchain setup and proto compilation rules are incompatible with the current tonic API and dependencies, leading to compilation errors and version conflicts.

This forced us to create our own solution that works reliably with modern versions of both prost and tonic.

## Our Custom Solution

We built a three-part system in the `proto/` folder:

### 1. Custom Compiler Binary

Instead of relying on `rules_rust`'s prost toolchain, we use the official `tonic-build` ecosystem:

```rust
// proto/src/main.rs
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let out_dir = std::env::var("OUT_DIR")?;
    std::fs::create_dir_all(&out_dir)?;

    tonic_prost_build::configure()
        .out_dir(&out_dir)
        .compile_protos(&["./protos/hello.proto"], &["./protos"])?;

    Ok(())
}
```

This compiler:
- Reads the `OUT_DIR` environment variable to determine where to generate code
- Uses `tonic_prost_build` directly to compile proto files
- Generates both message structs and gRPC service traits

### 2. Bazel Build Configuration

The BUILD.bazel file in the proto folder orchestrates the compilation:

```python
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
    crate_name = "hello_proto",
    deps = [
        "@crates//:prost",
        "@crates//:tonic",
    ],
)
```

## Usage in the Project

Once compiled, the generated proto code integrates seamlessly:

```rust
use hello_proto::hello_service_server::HelloService;
use hello_proto::{HelloRequest, HelloResponse};

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
