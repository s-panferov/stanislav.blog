import Image from 'next/image';
import { withBasePath } from '@/lib/basePath';
import FormattedDate from '@/components/FormattedDate';
import Tag from '@/components/Tag';
import styles from '../post.module.css';

export default function BazelRustProtoCompilation() {
  const post = {
    title: 'Setting up Protocol Buffer compilation with Bazel and Rust',
    description: 'How to build a custom proto compilation pipeline when the official rules_rust documentation no longer works with modern tonic versions',
    pubDate: new Date('2025-09-01'),
    heroImage: withBasePath('/assets/bazel-tonic.png'),
    tags: ['bazel', 'rust', 'protobuf', 'build-systems', 'grpc', 'tonic']
  };

  return (
    <article className={styles.article}>
      <div className={styles.heroImage}>
        <Image
          src={post.heroImage}
          alt={post.title}
          width={1020}
          height={510}
          priority
        />
      </div>
      <div className={styles.prose}>
        <div className={styles.date}>
          <FormattedDate date={post.pubDate} />
        </div>
        <h1>{post.title}</h1>
        <div className={styles.tags}>
          {post.tags.map((tag) => (
            <Tag key={tag} tag={tag} />
          ))}
        </div>
        <hr />

        <p>In this post, I'll explain how we set up Protocol Buffer compilation in our Rust project using Bazel, and why we had to build a custom solution.</p>

        <h2>The Problem with Official Documentation</h2>

        <p>The official rules_rust documentation for rust_prost (https://bazelbuild.github.io/rules_rust/rust_prost.html) unfortunately no longer works with recent versions of tonic. The toolchain setup and proto compilation rules are incompatible with the current tonic API and dependencies, leading to compilation errors and version conflicts.</p>

        <p>This forced us to create our own solution that works reliably with modern versions of both prost and tonic.</p>

        <h2>Our Custom Solution</h2>

        <p>We built a three-part system in the <code>proto/</code> folder:</p>

        <h3>1. Custom Compiler Binary</h3>

        <p>Instead of relying on <code>rules_rust</code>'s prost toolchain, we use the official <code>tonic-build</code> ecosystem:</p>

        <pre><code>{`// proto/src/main.rs
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let out_dir = std::env::var("OUT_DIR")?;
    std::fs::create_dir_all(&out_dir)?;

    tonic_prost_build::configure()
        .out_dir(&out_dir)
        .compile_protos(&["./protos/hello.proto"], &["./protos"])?;

    Ok(())
}`}</code></pre>

        <p>This compiler:</p>
        <ul>
          <li>Reads the <code>OUT_DIR</code> environment variable to determine where to generate code</li>
          <li>Uses <code>tonic_prost_build</code> directly to compile proto files</li>
          <li>Generates both message structs and gRPC service traits</li>
        </ul>

        <h3>2. Bazel Build Configuration</h3>

        <p>The BUILD.bazel file in the proto folder orchestrates the compilation:</p>

        <pre><code>{`rust_binary(
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
)`}</code></pre>

        <h2>Usage in the Project</h2>

        <p>Once compiled, the generated proto code integrates seamlessly:</p>

        <pre><code>{`use hello_proto::hello_service_server::HelloService;
use hello_proto::{HelloRequest, HelloResponse};

#[tonic::async_trait]
impl HelloService for MyService {
    async fn say_hello(
        &self,
        request: Request<HelloRequest>,
    ) -> Result<Response<HelloResponse>, Status> {
        // Implementation
    }
}`}</code></pre>
      </div>
    </article>
  );
}
