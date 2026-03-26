import type { SocialLink } from "../types/social";
import { HESM_CONFIG } from "../constants/appConfig";

export const socialLinksMock: SocialLink[] = [
  {
    id: "social-instagram",
    label: "Instagram",
    url: HESM_CONFIG.instagramUrl,
  },
  {
    id: "social-facebook",
    label: "Facebook",
    url: HESM_CONFIG.facebookUrl,
  },
  {
    id: "social-web",
    label: "Sitio web",
    url: HESM_CONFIG.websiteUrl,
  },
];

