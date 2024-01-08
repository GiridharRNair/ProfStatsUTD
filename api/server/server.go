package server

func Init() {
	router := setUpRouter()

	err := router.Run(":80")
	if err != nil {
		panic(err)
	}
}
