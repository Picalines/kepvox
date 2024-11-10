package `scjs-dts`

import java.nio.file.{Files, Path, Paths}

import java.nio.charset.Charset
import scala.util.Using

object DtsGenerator {
  def main(args: Array[String]): Unit = args match {
    case Array(outFile) =>
      writeDeclaration(Paths.get(outFile).toAbsolutePath)
    case _ =>
      println("error: single relative path argument expected")
      sys.exit(1)
  }

  private def writeDeclaration(outFile: Path): Unit = {
    println(s"generating $outFile")
    Files.createDirectories(outFile.getParent)
    Using(Files.newBufferedWriter(outFile, Charset.defaultCharset())) {
      writer =>
        scClientDecl.write(writer)
        scClientConfigDecl.write(writer)
    }
  }

  private lazy val scClientDecl =
    ast.ExportDeclaration(
      ast.Class(
        name = "ScClient",
        base = None,
        implements = Seq.empty,
        members = Seq(
          ast.ClassMethod(
            name = "connect",
            parameters = Seq(
              ast.Parameter(
                "config",
                ast.PlainValueType("ScClientConfig", Seq())
              )
            ),
            returns = ast.PlainValueType(
              name = "Promise",
              parameters = Seq(
                ast.UnionType(
                  Seq(
                    ast.PlainValueType(
                      name = "ScClient",
                      parameters = Seq.empty
                    ),
                    ast.Null
                  )
                )
              )
            )
          ),
          ast.InstanceMethod(
            name = "freeAll",
            parameters = Seq(),
            returns = ast.Void
          )
        )
      )
    )

  private lazy val scClientConfigDecl = ast.ExportDeclaration(
    ast.ShapeType(
      name = "ScClientConfig",
      members = Seq(
        ast.Field("port", ast.Number, isOptional = false),
        ast.Field("timeout", ast.Number, isOptional = true),
        ast.Field("serverName", ast.String, isOptional = true)
      )
    )
  )
}
