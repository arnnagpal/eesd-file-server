<script>
  import { onMount } from 'svelte';

  let files = [];

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
  });
</script>

<style>
  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin: 0.5rem 0;
  }
</style>

<ul>
  {#each files as file}
    <!-- make it so when clicked, it opens the file in the /open route -->
    <li><a href="/open/{file}">{file}</a></li>
  {/each}
</ul>
