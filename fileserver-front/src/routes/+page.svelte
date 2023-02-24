<script>
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { Circle } from "svelte-loading-spinners";

  let files = [];
  let show = false;
  let opening = "";

  onMount(async () => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };
    const response = await fetch("/api/files", reqOptions);

    if (response.ok) {
      let res = await response.json();
      let data = res.data;
      for (let i = 0; i < data.files.length; i++) {
        let fileName = data.files[i];
        //remove .json
        fileName = fileName.substring(0, fileName.length - 5);
        //add .xlsx
        fileName = fileName + ".xlsx";
        files.push(fileName);
      }

      files = files;
      show = true;
    } else {
      alert("HTTP-Error: " + response.status);
    }

  });

  function openFile(file) {
    // href to /open/filename after animating out
    console.log("opening file: " + file);
    opening = file;
    setTimeout(() => {
      window.location.href = "/open/" + file;
    }, 500);
  }
</script>

<style>

    @keyframes fly {
        0% {
            opacity: 0;
            transform: translateX(-100px);
        }
        100% {
            opacity: 1;
            transform: translateX(0px);
        }
    }

    /* animation to the right and fade out */
    .fly {
        animation: fly 0.2s ease-in-out;
    }

    a {
        display: block;
        padding: 10px;
        text-decoration: none;
        color: #333;
        font-family: Arial, sans-serif;
        font-size: 14px;
        transition: all 0.3s ease;
        background-color: #fff;
        border-bottom: 1px solid #eee;
    }

    a:hover {
        background-color: #f6f6f6;
    }

    a::before {
        font-family: "Font Awesome 5 Free",sans-serif;
        content: "";
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 10px;
        background-repeat: no-repeat;
        background-size: contain;
    }

    a.file::before {
        content: "\f15b";
    }

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

    @media(prefers-color-scheme: dark) {
        a {
            color: #fff;
            background-color: #333;
            border-bottom: 1px solid #555;
        }

        a:hover {
            background-color: #555;
        }

        :global(body) {
            background-color: #222;
        }
    }
</style>

{#if !show}
  <div class="middle" in:fade={{ delay: 100 }}>
    <Circle size="60" color="#FF3E00" unit="px" duration="1s" />
  </div>
{:else}
  <ul>
    {#each files.filter(f => f !== opening) as file}
      <!-- make it so when clicked, it opens the file in the /open route -->
      <li in:fly={{ x: -100, duration: 500 }} out:fly={ { x: 100, duration: 500} }>
        <a class="file" href="/" on:click={() => openFile(file)}>{file}</a>
      </li>
    {/each}
  </ul>
{/if}

