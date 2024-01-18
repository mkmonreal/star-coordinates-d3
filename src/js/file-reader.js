export const setUpFileInput = (processFunction) => {
    document.addEventListener("DOMContentLoaded", () => {
        document.getElementById("file").addEventListener("change", () => {
            const fileReader = new FileReader();
            const file = document.getElementById("file").files[0];
            fileReader.onload = (ev) => {
                processFunction(ev);
            };
            fileReader.readAsText(file, "UTF-8");
        });
    });
};
