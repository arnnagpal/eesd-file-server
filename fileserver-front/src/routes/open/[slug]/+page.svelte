<script>
    import XLSX from "xlsx";
    import {onMount} from "svelte";
    import {Sheet, download} from "svelte-sheets";
    import {downloadJSON} from "$lib/utilities";
    import {page} from '$app/stores';
    import { Circle } from "svelte-loading-spinners";
    import { fade } from 'svelte/transition';

    let open;
    let currentValue;
    let selected;
    let active = 0;
    let sheets = [];
    let sheetNames = [];
    let sheet;

    let fileName;

    onMount(async () => {
        fileName = $page.params.slug;
        console.log(fileName);

        if (!fileName) {
            console.log("error");
            window.location.href = "/";
        }

        await refresh();
    });

    async function refresh() {
        const reqOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        let url = `/api/files/get/` + fileName;
        let response = await fetch(url, reqOptions);
        let data = await response.json();
        let rawText = data.data.file;
        console.log(data);
        let fileData = JSON.parse(rawText);
        sheets = [fileData]
        sheetNames = [fileName]

        sheets = sheets;
        sheet = sheets[active];
    }

    const decode = XLSX.utils.decode_cell;

    $: sheet = sheets[active];

    $: decoded = selected?.[0] ? decode(selected[0]) : {c: 0, r: 0};
</script>
{#if !sheet}
    <div class="middle" in:fade={{ delay: 100 }}>
        <Circle size="60" color="#FF3E00" unit="px" duration="1s"  />
    </div>
{/if}

{#if sheet}
    <button
            class="btn secondary"
            on:click={(_) => refresh()}
    >
        <i class="fas fa-download mr-1"/>Refresh data
    </button>
    <button
            class="btn secondary"
            on:click={(_) => download(sheets, sheetNames[active])}
    >
        <i class="fas fa-download mr-1"/>Download file
    </button>
    <button
            class="btn secondary"
            on:click={(_) => downloadJSON(sheet, sheetNames[active])}
    >
        <i class="fas fa-download mr-1"/>Download JSON
    </button>
{/if}

{#if sheet}
    <input
            bind:value={sheet.data[decoded.r][decoded.c]}
            style={{ width: "50vw" }}
            on:change={(v) => console.log("change", v)}
    />
    <Sheet
            bind:data={sheet.data}
            columns={sheet.columns}
            rows={sheet.rows}
            mergeCells={sheet.mergeCells || {}}
            options={{ tableHeight: "90vh" }}
            style={sheet.style || {}}
            bind:currentValue
            bind:selected
    />
{/if}

<div class="sheet-names">
    {#each sheetNames as sn, i (sn)}
    <span class:selected={sheet.sheetName === sn} on:click={(_) => (active = i)}
    >{sn}</span
    >
    {/each}
</div>

<style>
    .sheet-names {
        text-align: center;
        position: fixed;
        bottom: 0;
        width: 100%;
        padding: 1rem;
    }

    .selected {
        text-decoration: underline;
    }

    .middle {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: 0.2s;
    }
</style>
