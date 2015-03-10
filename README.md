# dispatcher
The entrance of the appointments service. To support gray release (partial deployment), it will dispatch requests to different app versions.

# Virtual Applications Layout
All virtual applications should be placed in `vapps/<vappname>/v<version>`.

# How to run
    $ npm run dev # for development
    $ npm start   # for production
