<script>
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { Circle } from "svelte-loading-spinners";

  let files = [];
  let show = false;

  onMount(async () => {
    const response = await fetch('http://localhost:3001/api/files');
    let res = await response.json();
    let data = res.data;
    for (let i = 0; i < data.files.length; i++) {
      let fileName = data.files[i];
      //remove .json
      fileName = fileName.substring(0, fileName.length - 5);
      //add .xlsx
      fileName = fileName + '.xlsx';
      files.push(fileName);
    }

    files = files;
    show = true;
  });
</script>

<style>
  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin: 0.5rem 0.5rem;
  }

  .middle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: 0.2s;
  }
</style>

{#if !show}
  <div class="middle" in:fade={{ delay: 100 }}>
    <Circle size="60" color="#FF3E00" unit="px" duration="1s"  />
  </div>
{:else}
  <ul>
    {#each files as file}
      <!-- make it so when clicked, it opens the file in the /open route -->
      <li in:fly={{delay: 100, x: -50}} out:fly={{x: 50}} ><a href="/open/{file}">{file}</a></li>
    {/each}
  </ul>
{/if}

