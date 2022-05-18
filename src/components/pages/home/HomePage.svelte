<script lang="ts">
  import HomeBanner from "./HomeBanner.svelte";
  import ContentArea from "../../shared/ContentArea.svelte";
  import ThreeFeatures from "./ThreeFeatures.svelte";
  import SocialLinks from "./SocialLinks.svelte";
  import CodeDemo from "./CodeDemo.svelte";
  import Credits from "./Credits.svelte";
</script>

<svelte:head>
  <title>Sims 4 Toolkit</title>
</svelte:head>
<section id="home">
  <HomeBanner />
  <ContentArea banded={false}>
    <slot>
      <ThreeFeatures />
    </slot>
  </ContentArea>
  <ContentArea banded={true}>
    <slot>
      <CodeDemo
        title="Fully Functional Tuning DOM"
        description="Whether you're reading, editing, or creating a tuning resource, S4TK's built-in XML DOM makes everything from batch fixes to file generation a breeze."
        code={`if (tuning.root.attributes.c === "Trait") {
  const ageList = tuning.root.findChild("ages");

  ageList.addChildren(
    E({ value: "ADULT" }),
    E({ value: "ELDER" })
  );
}`}
      />
    </slot>
  </ContentArea>
  <ContentArea banded={false}>
    <slot>
      <CodeDemo
        reverse={true}
        title="Easily Editable Binary Resources"
        description="Working with packages, string tables, and SimDatas is just as easy as plain-text XML, since they each come with their own fluent model. SimDatas can also be edited as XML, if that's what you're used to."
        code={`const mergedStbl = new StringTableResource();

listOfStbls.forEach(stbl => {
  mergedStbl.addAll(stbl.entries);
});

pkg.add(key, mergedStbl);`}
      />
    </slot>
  </ContentArea>
  <ContentArea banded={true}>
    <slot>
      <CodeDemo
        title="Simple, Efficient, and Versatile"
        description="Extracting files? Just read the ones you need, and skip over everything else. Merging packages? Cache their buffers to reduce runtime by more than 60%. Need something non-blocking? Just use one of the async methods."
        code={`Package.extractResourcesAsync(buffer, {
  resourceFilter(type, group, instance) {
    return type === BinaryResourceType.SimData;
  }
}).then(simdataEntries => {
  simdataEntries.forEach(doStuff);
});`}
      />
    </slot>
  </ContentArea>
  <ContentArea banded={false}>
    <slot>
      <SocialLinks />
      <Credits />
    </slot>
  </ContentArea>
</section>

<style lang="scss">
  // intentionally blank
</style>
