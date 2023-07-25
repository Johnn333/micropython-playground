import FileSystem from "./modules/FileSystem.mjs";

import LlvmBoxProcess from "./modules/LlvmBoxProcess.mjs";
import Python3Process from "./modules/Python3Process.mjs";

class LLVM {
    initialised = false;

    constructor(){
        this.init();
    }

    fileSystem = null;
    tools = {};
    clangdStdio;

    async init() {
        postMessage({
            target: "worker",
            type: "info",
            body: "Populating File System",
        })

        console.log("here");
        const fileSystem = await new FileSystem();
        this.fileSystem = fileSystem;

        await fileSystem.unpack("./root.pack.br");

        await fileSystem.pull();

        const processConfig = {
            FS: fileSystem.FS
        };

        postMessage({
            target: "worker",
            type: "info",
            body: "Initialising Tools",
        })

        const tools = {
            "llvm-box": new LlvmBoxProcess(processConfig),
            "python": new Python3Process(processConfig),
        };
        this.tools = tools;

        for (let tool in tools) {
            await tools[tool];
        };


        postMessage({
            target: "worker",
            type: "info",
            body: "Ready",
        })
        
        //let out = await llvm.run('python','../lib/micropython/py/makeversionhdr.py','mpversion.h');
        this.fileSystem.writeFile("/working/hello.py","print('Hello World')");
        let out = await llvm.run('python','hello.py');
        console.log(out);

        console.log(await this.fileSystem.analyzePath("/working"));
        this.initialised = true;
    };

    onprocessstart = () => {};
    onprocessend = () => {};
    onstdout = () => {};
    onstderr = () => {};

    async run(...args) {
        return await this.tools[args[0]].exec(args, {
            print: (...args) => this.onstdout(...args),
            printErr: (...args) => this.onstderr(...args),
            cwd: "/working"
        })
    };

    //Cannot get readFile() to work, not sure if its due to the encoding of MICROBIT.hex,
    //FileSystem only allows 'utf8' and 'binary'. This returns the byte array anyway.
    async getHex(){
        let arr = Array.from(await this.fileSystem.FS.analyzePath('/working/MICROBIT.hex').object.contents);
        while(arr[arr.length-1] === 0) arr.pop(); // Removing trailing Zeroes, Array is ~twice the size it needs to be
        return Uint8Array.from(arr);
    };

    async saveFiles(files) {
        for (let f in files) {
            this.saveFile(f, files[f]);
        }
    }

    async saveFile(name, contents){
        await this.fileSystem.writeFile('/working/'+name,contents);
    };
}

const includeConst = ['-I/include','-I/include/arm-none-eabi-c++/c++/10.3.1',
'-I/include/arm-none-eabi-c++','-I/include/arm-none-eabi-c++/arm-none-eabi/thumb/v7e-m+fp/softfp','-I/include/arm-none-eabi-c++/c++/10.3.1/arm-none-eabi',
'-I/include/arm-none-eabi-c++/backward','-I/include/arm-none-eabi/include','-I/include/arm-none-eabi/include-fixed',
'-I/libraries','-I/source/samples','-I/libraries/codal-microbit-v2/inc','-I/libraries/codal-microbit-v2/inc/bluetooth',
'-I/libraries/codal-microbit-v2/inc/compat','-I/libraries/codal-microbit-v2/model','-I/libraries/codal-nrf52/inc',
'-I/libraries/codal-nrf52/inc/cmsis','-I/libraries/codal-nrf52/nrfx/mdk','-I/libraries/codal-nrf52/nrfx',
'-I/libraries/codal-nrf52/nrfx/templates','-I/libraries/codal-nrf52/nrfx/templates/nRF52833',
'-I/libraries/codal-nrf52/nrfx/drivers/include','-I/libraries/codal-nrf52/nrfx/drivers/src',
'-I/libraries/codal-core/./inc/core','-I/libraries/codal-core/./inc/driver-models','-I/libraries/codal-core/./inc/drivers',
'-I/libraries/codal-core/./inc/streams','-I/libraries/codal-core/./inc/types',
'-I/libraries/codal-microbit-nrf5sdk/../codal-nrf52/nrfx/hal','-I/libraries/codal-microbit-nrf5sdk/sdk_config',
'-I/libraries/codal-microbit-nrf5sdk/nRF5SDK_mods','-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/pwr_mgmt',
'-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/sortlist','-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/strerror',
'-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/softdevice/common','-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/crc32',
'-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/bootloader/dfu','-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/util',
'-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/ble/common','-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/balloc',
'-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/ble/peer_manager','-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/ringbuf',
'-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/timer','-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/log',
'-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/ble/nrf_ble_gatt','-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/bootloader',
'-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/fstorage','-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/experimental_section_vars',
'-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/softdevice/s113/headers','-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/mutex',
'-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/delay','-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/bootloader/ble_dfu',
'-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/atomic_fifo','-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/atomic',
'-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/memobj','-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/fds',
'-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/atomic_flags','-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/softdevice/s113/headers/nrf52',
'-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/ble/ble_services/ble_dfu','-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/external/fprintf',
'-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/svc','-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/libraries/log/src',
'-I/libraries/codal-microbit-nrf5sdk/nRF5SDK/components/ble/ble_services/ble_dis']


async function buildMicropython(fileArray) {
    //Compilation step using clang.wasm module. Mostly copied from microbit-v2-samples final compilation step with some extra flags to supress clang warnings.  
    let fileName;
    let filesToLink = [];
    let allFiles = [];

    for(let f in fileArray) {
        fileName = fileArray[f];
        allFiles.push(fileName);
        if(fileName.includes(".cpp")){
            let clangOutput = await llvm.run('clang++','-include-pch','../include/MicroBit.h.pch','--target=arm-none-eabi','-DMICROBIT_EXPORTS',...includeConst,'-Wno-expansion-to-defined','-mcpu=cortex-m4','-mthumb','-mfpu=fpv4-sp-d16',
            '-mfloat-abi=softfp','-fno-exceptions','-fno-unwind-tables','-ffunction-sections','-fdata-sections','-Wall','-Wextra','-Wno-unused-parameter','-std=c++11',
            '-fwrapv','-fno-rtti','-fno-threadsafe-statics','-fno-exceptions','-fno-unwind-tables','-Wno-array-bounds','-include', '/include/codal_extra_definitions.h',
            '-Wno-inconsistent-missing-override','-Wno-unknown-attributes','-Wno-uninitialized','-Wno-unused-private-field','-Wno-overloaded-virtual','-Wno-mismatched-tags','-Wno-deprecated-register',
            '-I"/include"','-O2','-g','-DNDEBUG','-DAPP_TIMER_V2','-DAPP_TIMER_V2_RTC1_ENABLED','-DNRF_DFU_TRANSPORT_BLE=1','-DNRF52833_XXAA','-DNRF52833','-DTARGET_MCU_NRF52833',
            '-DNRF5','-DNRF52833','-D__CORTEX_M4','-DS113','-DTOOLCHAIN_GCC', '-D__START=target_start','-MMD','-MT',fileName+'.obj','-MF','DEPFILE',
            '-o',fileName+'.obj','-c', fileName);

            postMessage({
                target: "compile",
                type: "output",
                source: "clang",
                body: clangOutput,
            })

            if(isError(clangOutput.stderr)){
                postMessage({
                    target: "compile",
                    type: "stderr",
                    source: "clang",
                    body: clangOutput.stderr,
                });

                return false;
            }
            filesToLink.push(fileName+".obj");
        }
    }
  
    //Linking to create MICROBIT executable using lld.wasm module. Copied from microbit-v2-samples final linking step. 
    let linkOutput = await llvm.run('ld.lld','-plugin','/libraries/arm-none-eabi/liblto_plugin.so','-plugin-opt=/libraries/arm-none-eabi/lto-wrapper', '-plugin-opt=-fresolution=/tmp/ccJn9KUK.res',
    '-plugin-opt=-pass-through=-lgcc','-plugin-opt=-pass-through=-lc_nano','-plugin-opt=-pass-through=-lgcc','-plugin-opt=-pass-through=-lc_nano',
    '-X','-o','MICROBIT','/libraries/arm-none-eabi/thumb/v7e-m+fp/softfp/crti.o','/libraries/arm-none-eabi/thumb/v7e-m+fp/softfp/crtbegin.o',
    '/libraries/arm-none-eabi-newlib/thumb/v7e-m+fp/softfp/crt0.o','-L/libraries/arm-none-eabi/thumb/v7e-m+fp/softfp',
    '-L/libraries/arm-none-eabi-newlib/thumb/v7e-m+fp/softfp','-L/libraries/arm-none-eabi','-L/libraries/arm-none-eabi-newlib','--gc-sections',
    '--sort-common','--sort-section=alignment','--gc-sections','--wrap', 'atexit','--start-group','-lstdc++_nano','-lsupc++_nano','-lgcc','-lnosys','--end-group',
    '-Map','MICROBIT.map','--start-group',...filesToLink,'/libs/libcodal-microbit-v2.a','/libs/libcodal-core.a','/libs/libcodal-nrf52.a',
    '/libs/libcodal-microbit-nrf5sdk.a','/libs/libcodal-nrf52.a','/libs/libcodal-core.a','/libraries/codal-microbit-v2/lib/bootloader.o',
    '/libraries/codal-microbit-v2/lib/mbr.o','/libraries/codal-microbit-v2/lib/settings.o', '/libraries/codal-microbit-v2/lib/softdevice.o',
    '/libraries/codal-microbit-v2/lib/uicr.o','-lnosys','-lstdc++_nano','-lsupc++_nano','-lm','-lc_nano','-lgcc','-lstdc++_nano','-lsupc++_nano',
    '-lm','-lc_nano','-lgcc','--end-group','-lstdc++_nano','-lm','-lc_nano','--start-group','-lgcc','-lc_nano','--end-group',
    '--start-group','-lgcc','-lc_nano','--end-group','/libraries/arm-none-eabi/thumb/v7e-m+fp/softfp/crtend.o','/libraries/arm-none-eabi/thumb/v7e-m+fp/softfp/crtn.o',
    '-T','/libraries/codal-microbit-v2/ld/nrf52833-softdevice.ld');

    postMessage({
        target: "compile",
        type: "output",
        source: "linker",
        body: linkOutput,
    })

    if (isError(linkOutput.stderr)) { 
        postMessage({
            target: "compile",
            type: "stderr",
            source: "linker",
            body: linkOutput.stderr,
        });
        
        return false;
    }

    //Converting MICROBIT executable to hex file. Using llvm-objcopy.wasm module.
    let objOutput = await llvm.run('llvm-objcopy', '-O', 'ihex', 'MICROBIT', 'MICROBIT.hex');
 
    postMessage({
        target: "compile",
        type: "output",
        source: "objcopy",
        body: objOutput,
    })

    return true;
}

//Checks if stderr is an error and not a warning
function isError(stderr) {
    return stderr.includes("error:");
}

async function clean() {
    let workingDir = await llvm.fileSystem.FS.analyzePath('/working/');
    let filesToRemove = workingDir.object.contents;

    for(let f in filesToRemove) {
        await llvm.fileSystem.unlink(`/working/${f}`);
    }
}

onmessage = async(e) => {
    const msg = e.data;
    
    switch (msg.type) {
        case "buildMicropython": handleBuildRequest(msg.body); break;
        default: 
            postMessage({
                target: "worker",
                type: "error",
                body: `Unhandled request message type '${msg.type}' received.\nFull message:\n${msg}`,
            })
            break;
            
    }
}

async function handleBuildRequest(files) {
    if (!llvm.initialised) {
        postMessage({
            target: "worker",
            type: "error",
            body: "Cannot compile yet, worker is not yet initialised"
        })
        return;
    }

    llvm.saveFiles(files);
        
    let success = await compileCode(Object.keys(files))
    
    if (success) {
        const hex = await llvm.getHex();
        postMessage({
            target: "compile",
            type: "hex",
            body: hex,
        });
    } else {
        postMessage({
            target: "compile",
            type: "error",
            body: "Compilation failed",
        })
    }

    postMessage({
        target: "compile",
        type: "compile-complete",
    })

    await clean();
}



const llvm = new LLVM();