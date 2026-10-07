const readme = await Bun.file('README.md').text()
for (const match of readme.matchAll(/\]\(\.\/(.*?)\)/g)) {
  if (!(await Bun.file(match[1]).exists())) throw new Error(`Missing local README link: ${match[1]}`)
}
console.log('README local links pass')
