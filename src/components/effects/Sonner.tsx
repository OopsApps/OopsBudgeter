/*
 *   Copyright (c) 2025 Laith Alkhaddam aka Iconical or Sleepyico.
 *   All rights reserved.

 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at

 *   http://www.apache.org/licenses/LICENSE-2.0

 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

import React from "react";
import { Icon } from "@iconify/react";
import { Toaster as Sonner } from "../ui/sonner";

export default function Toaster() {
  return (
    <div className="bg-secondary dark:bg-secondary rounded-lg">
      <Sonner
        position="top-center"
        className="toaster group"
        icons={{
          success: (
            <Icon
              icon="line-md:circle-to-confirm-circle-twotone-transition"
              className="h-5 w-5"
            />
          ),
          info: (
            <Icon
              icon="line-md:alert-circle-twotone-loop"
              className="h-5 w-5"
            />
          ),
          warning: (
            <Icon icon="line-md:alert-twotone-loop" className="h-5 w-5" />
          ),
          error: (
            <Icon icon="line-md:close-circle-twotone" className="h-5 w-5" />
          ),
          loading: <Icon icon="line-md:gauge-loop" className="h-5 w-5" />,
        }}
      />
    </div>
  );
}
