import { getLatestConfig } from "@/lib/mongo/actions/ConfigActions"

export default async function StreamPage(){
    const config = await getLatestConfig()
    return <div>
        <iframe width="560" height="315" src={config.youtubeEmbedUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
    </div>
}
//<iframe width="560" height="315" src="https://www.youtube.com/embed/ovEW5SCEmng?si=weyhEpu05lCk_TMW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>