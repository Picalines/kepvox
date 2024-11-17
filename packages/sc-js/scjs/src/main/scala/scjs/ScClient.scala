package scjs

import de.sciss.osc
import de.sciss.synth.{Client, Server, ServerConnection}
import de.sciss.synth.Ops._

import java.util.{Timer, TimerTask}
import scala.annotation.unused
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Promise
import scala.language.postfixOps
import scala.scalajs.js
import scala.scalajs.js.JSConverters._
import scala.scalajs.js.annotation._
import scala.scalajs.js.|
import scala.util.chaining.scalaUtilChainingOps

@JSExportTopLevel("ScClient")
class ScClient(private val server: Server) extends js.Object {
  @unused
  def freeAll(): Unit = server.freeAll()
}

@js.native
trait ScClientConfig extends js.Object {
  val port: Int = js.native
  val timeout: js.UndefOr[Int] = js.native
  val serverName: js.UndefOr[String] = js.native
}

@unused
object ScClient {
  private lazy val timer = new Timer(true)

  @unused
  @JSExportStatic
  def connect(config: ScClientConfig): js.Promise[ScClient | Null] = {
    val clientConfig = Client.Config()
    val serverConfig = Server.Config().tap { it =>
      it.transport = osc.Browser
      it.port = config.port
    }

    val promise = Promise[ScClient | Null]()
    val future = promise.future

    val connection = Server.connect(
      config.serverName.getOrElse("browser"),
      serverConfig,
      clientConfig
    ) {
      case ServerConnection.Running(server) =>
        promise.success(new ScClient(server))
      case ServerConnection.Aborted =>
        promise.success(null)
    }

    config.timeout.foreach { timeoutMillis =>
      val timeoutTask = new TimerTask {
        override def run(): Unit = connection.abort()
      }

      timer.schedule(timeoutTask, timeoutMillis)
      future.onComplete { _ => timeoutTask.cancel() }
    }

    future.toJSPromise
  }
}
