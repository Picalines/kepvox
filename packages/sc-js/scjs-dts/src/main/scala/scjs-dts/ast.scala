package `scjs-dts`

import java.io.Writer

object ast {
  sealed trait Writable {
    def write(implicit writer: Writer): Unit
  }

  private[ast] sealed abstract class ConstWritable(str: String)
      extends Writable {
    override def write(implicit writer: Writer): Unit = writer.write(str)
  }

  private def writeSeq(items: Seq[Writable], separator: String)(implicit
      writer: Writer
  ): Unit = {
    items match {
      case Seq(singleItem) => singleItem.write
      case firstItems :+ lastItem =>
        firstItems.foreach { item =>
          item.write
          writer.write(separator)
        }
        lastItem.write
      case _ =>
    }
  }

  sealed trait Declaration extends Writable

  case class ExportDeclaration(declaration: Declaration) extends Declaration {
    override def write(implicit writer: Writer): Unit = {
      writer.write("export ")
      declaration.write
    }
  }

  sealed trait ValueType extends Writable

  case object Void extends ConstWritable("void") with ValueType

  case object Undefined extends ConstWritable("undefined") with ValueType

  case object Null extends ConstWritable("null") with ValueType

  case object Boolean extends ConstWritable("boolean") with ValueType

  case object Number extends ConstWritable("number") with ValueType

  case object String extends ConstWritable("string") with ValueType

  case class PlainValueType(name: String, parameters: Seq[ValueType])
      extends ValueType {

    override def write(implicit writer: Writer): Unit = {
      writer.write(name)

      if (parameters.nonEmpty) {
        writer.write('<')
        writeSeq(parameters, ",")
        writer.write('>')
      }
    }
  }

  case class UnionType(variants: Seq[ValueType]) extends ValueType {
    override def write(implicit writer: Writer): Unit = {
      writeSeq(variants, "|")
    }
  }

  case class ShapeType(members: Seq[Member]) extends ValueType {
    override def write(implicit writer: Writer): Unit = {
      writer.write('{')
      writeSeq(members, ",")
      writer.write('}')
    }
  }

  sealed trait Member extends Writable

  case class Field(name: String, valueType: ValueType, isOptional: Boolean)
      extends Member {
    override def write(implicit writer: Writer): Unit = {
      writer.write(name)
      if (isOptional) writer.write('?')
      writer.write(':')
      valueType.write
    }
  }

  case class Parameter(name: String, valueType: ValueType) extends Writable {
    override def write(implicit writer: Writer): Unit = {
      writer.write(name)
      writer.write(':')
      valueType.write
    }
  }

  case class Method(
      name: String,
      parameters: Seq[Parameter],
      returns: ValueType,
      isStatic: Boolean
  ) extends Member {
    override def write(implicit writer: Writer): Unit = {
      if (isStatic) writer.write("static ")
      writer.write(name)
      writer.write('(')
      writeSeq(parameters, ",")
      writer.write("):")
      returns.write
    }
  }

  sealed trait TypeDeclaration extends Declaration {
    def name: String
  }

  case class TypeAlias(name: String, valueType: ValueType)
      extends TypeDeclaration {
    override def write(implicit writer: Writer): Unit = {
      writer.write("type ")
      writer.write(name)
      writer.write(" = ")
      valueType.write
    }
  }

  case class Class(
      name: String,
      base: Option[PlainValueType],
      implements: Seq[PlainValueType],
      members: Seq[Member]
  ) extends TypeDeclaration {
    override def write(implicit writer: Writer): Unit = {
      writer.write("class ")
      writer.write(name)
      writer.write(' ')
      base.foreach { baseType =>
        writer.write("extends ")
        baseType.write
        writer.write(' ')
      }
      if (implements.nonEmpty) {
        writer.write("implements ")
        writeSeq(implements, ",")
        writer.write(' ')
      }
      writer.write('{')
      writeSeq(members, ";")
      writer.write('}')
    }
  }

  case class EnumValue(name: String, value: Either[String, Int])
      extends Writable {
    override def write(implicit writer: Writer): Unit = {
      writer.write(name)
      writer.write('=')
      value match {
        case Left(str) =>
          writer.write('"')
          writer.write(str)
          writer.write('"')
        case Right(int) =>
          writer.write(int)
      }
    }
  }

  case class Enum(name: String, values: Seq[EnumValue])
      extends TypeDeclaration {
    override def write(implicit writer: Writer): Unit = {
      writer.write("enum ")
      writer.write(name)
      writer.write(" {")
      writeSeq(values, ",")
      writer.write('}')
    }
  }
}
