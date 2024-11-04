initialize := {
  val _ = initialize.value

  val required = VersionNumber("17")
  val current = VersionNumber(sys.props("java.specification.version"))
  if (current != required) {
    println(s"Java $required is required to compile this project")
    sys.exit(1)
  }
}

lazy val root = project.in(file("."))
  .enablePlugins(ScalaJSPlugin)
  .settings(
    name := "sc-js",
    scalaVersion := "2.13.6",
    libraryDependencies += "de.sciss" %%% "scalacollider" % "2.7.4",
    Global / onChangedBuildSource := ReloadOnSourceChanges,
    Compile / fullOptJS / artifactPath := baseDirectory.value / "dist" / "sc.js",
    scalaJSLinkerConfig ~= {
      _.withModuleKind(ModuleKind.ESModule)
    },
  )
