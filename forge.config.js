module.exports = {
    packagerConfig: {},
    rebuildConfig: {},
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {},
        },
        {
            name: "@electron-forge/maker-zip",
            platforms: ["darwin"],
        },
        {
            name: "@reforged/maker-appimage",
            config: {
                name: "Timekeeper",
                options: {
                    // Use a local runtime so the build does not rely on
                    // network access when creating the AppImage.
                    runtime: "./resources/runtime-x86_64",
                },
            },
        },
    ],
};
