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
            },
        },
    ],
};
